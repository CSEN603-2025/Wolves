import React, { useState, useEffect, useRef } from 'react';
import './VideoCall.css';

import micOpenIcon from '../assets/icons/mic-open-icon.png';
import micClosedIcon from '../assets/icons/mic-closed-icon.png';
import videoCameraIcon from '../assets/icons/video-camera-icon.png';
import shareScreenIcon from '../assets/icons/share-screen-icon.png';
import endCallIcon from '../assets/icons/end-call-icon.png';

const ADMIN_VIDEO_SRC = require('../assets/videos/admin-call.mp4');
const STUDENT_VIDEO_SRC = require('../assets/videos/student-call.mp4');

const VideoCall = ({ 
  isOpen, 
  onClose, 
  isAdmin, 
  appointmentId,
  onCallEnd 
}) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callerLeft, setCallerLeft] = useState(false);
  const [videoFadedOut, setVideoFadedOut] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const webcamRef = useRef(null);
  const webcamStreamRef = useRef(null);
  const screenRef = useRef(null);
  const screenStreamRef = useRef(null);
  const audioAnalyserRef = useRef(null);
  const timerRef = useRef(null);

  // Choose remote video based on user type
  const remoteVideoSrc = isAdmin ? ADMIN_VIDEO_SRC : STUDENT_VIDEO_SRC;

  // Setup webcam/mic
  useEffect(() => {
    if (!isOpen) return;
    let localStream;
    let audioContext;
    let analyser;
    let animationId;

    const setupStream = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        webcamStreamRef.current = localStream;
        if (webcamRef.current) {
          webcamRef.current.srcObject = localStream;
        }
        // Setup speaking detection
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(localStream);
        analyser = audioContext.createAnalyser();
        source.connect(analyser);
        audioAnalyserRef.current = analyser;
        const dataArray = new Uint8Array(analyser.fftSize);
        const detectSpeaking = () => {
          analyser.getByteTimeDomainData(dataArray);
          const isLoud = dataArray.some(v => Math.abs(v - 128) > 15);
          setIsSpeaking(isLoud && !isMuted);
          animationId = requestAnimationFrame(detectSpeaking);
        };
        detectSpeaking();
      } catch (err) {
        if (webcamRef.current) webcamRef.current.srcObject = null;
      }
    };
    setupStream();
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (audioContext) audioContext.close();
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      setIsSpeaking(false);
    };
  }, [isOpen, isMuted]);

  // Handle mute/unmute
  useEffect(() => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted]);

  // Handle video on/off
  useEffect(() => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = isVideoEnabled;
      });
    }
  }, [isVideoEnabled]);

  // Handle screen sharing
  const handleToggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        if (screenRef.current) {
          screenRef.current.srcObject = screenStream;
        }
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
        };
        setIsScreenSharing(true);
      } catch (err) {
        // user cancelled
      }
    } else {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsScreenSharing(false);
    }
  };

  // Timer and call end logic
  useEffect(() => {
    if (!isOpen) return;
    timerRef.current = setInterval(() => {
      setCallDuration(prev => {
        if (prev >= 30) {
          setCallerLeft(true);
          clearInterval(timerRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  // Fade out video when caller leaves
  useEffect(() => {
    if (callerLeft) {
      setTimeout(() => setVideoFadedOut(true), 700);
    } else {
      setVideoFadedOut(false);
    }
  }, [callerLeft]);

  // Cleanup all streams on end call
  const cleanupStreams = () => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach(track => track.stop());
      webcamStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
  };

  const handleToggleVideo = () => {
    setIsVideoEnabled(v => !v);
  };

  const handleToggleMute = () => {
    setIsMuted(m => !m);
  };

  const handleEndCall = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    cleanupStreams();
    onCallEnd();
    onClose();
  };

  // Always set webcam stream to PiP video
  useEffect(() => {
    if (webcamRef.current && webcamStreamRef.current) {
      webcamRef.current.srcObject = webcamStreamRef.current;
    }
  }, [isOpen, isVideoEnabled, isMuted]);

  // Set screen stream to split-right video when sharing
  useEffect(() => {
    if (isScreenSharing && screenRef.current && screenStreamRef.current) {
      screenRef.current.srcObject = screenStreamRef.current;
    }
  }, [isScreenSharing]);

  if (!isOpen) return null;

  return (
    <div className="video-call-overlay">
      <div className="video-call-container">
        <div className="video-call-header">
          <h2>Video Call</h2>
          <span className="call-duration">
            {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
          </span>
        </div>
        <div className={`video-call-content${isScreenSharing ? ' split' : ''}`}>
          {/* Main area: remote video or split view */}
          {!isScreenSharing && !videoFadedOut && (
            <video
              className="main-video remote-video"
              src={remoteVideoSrc}
              autoPlay
              loop
              muted
              playsInline
            />
          )}
          {isScreenSharing && !videoFadedOut && (
            <>
              <video
                className="main-video remote-video split-left"
                src={remoteVideoSrc}
                autoPlay
                loop
                muted
                playsInline
              />
              <video
                ref={screenRef}
                className="main-video split-right"
                autoPlay
                playsInline
                muted
              />
            </>
          )}
          {/* PiP webcam */}
          {!videoFadedOut && (
            <video
              ref={webcamRef}
              className={`pip-video${isSpeaking ? ' speaking' : ''}${!isVideoEnabled ? ' video-disabled' : ''}`}
              autoPlay
              playsInline
              muted
            />
          )}
          {callerLeft && videoFadedOut && (
            <div className="caller-left-notification">
              <p>The other participant has left the call</p>
              <button className="iv-btn primary" onClick={handleEndCall}>
                End Call
              </button>
            </div>
          )}
        </div>
        <div className="video-call-controls">
          <button
            className={`control-btn`}
            onClick={handleToggleVideo}
            title={isVideoEnabled ? 'Disable Video' : 'Enable Video'}
          >
            <img src={videoCameraIcon} alt="Video" className="icon-grey" />
          </button>
          <button
            className={`control-btn`}
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <img src={isMuted ? micClosedIcon : micOpenIcon} alt="Mic" className="icon-grey" />
          </button>
          <button
            className={`control-btn${isScreenSharing ? ' active' : ''}`}
            onClick={handleToggleScreenShare}
            title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
          >
            <img src={shareScreenIcon} alt="Share Screen" className="icon-green" />
          </button>
          <button
            className="control-btn end-call"
            onClick={handleEndCall}
            title="End Call"
          >
            <img src={endCallIcon} alt="End Call" className="icon-grey" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall; 