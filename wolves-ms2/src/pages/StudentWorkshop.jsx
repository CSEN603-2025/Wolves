import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import mockWorkshops from '../data/student-workshops.json';
import './StudentWorkshop.css';
import Modal from '../components/Modal';
import messagesData from '../data/messages.json';
import endCallIcon from '../assets/icons/end-call-icon.png';
import LiveModal from '../components/LiveModal';
import { FaStar } from 'react-icons/fa';
import jsPDF from 'jspdf';

const StudentWorkshop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [videoEnded, setVideoEnded] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatTimers, setChatTimers] = useState([]);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [recordingNotes, setRecordingNotes] = useState([]);
  const [recordingNoteInput, setRecordingNoteInput] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  useEffect(() => {
    // Try to load from sessionStorage first
    const stored = sessionStorage.getItem('workshops');
    let workshopsArr = [];
    if (stored) {
      workshopsArr = JSON.parse(stored);
    } else {
      workshopsArr = mockWorkshops.workshops;
    }
    const found = workshopsArr.find(w => w.id === id);
    setWorkshop(found);
  }, [id]);

  // Play video for 30s, then instructor leaves
  useEffect(() => {
    if (showLiveModal) {
      setVideoEnded(false);
      // Reset chat
      setChatMessages([]);
      // Schedule video end
      const videoTimer = setTimeout(() => setVideoEnded(true), 30000);
      // Schedule chat messages
      let timers = [];
      let delay = 0;
      messagesData.forEach((msg, i) => {
        // Random delay between 4-6s
        delay += 4000 + Math.floor(Math.random() * 2000);
        const t = setTimeout(() => {
          setChatMessages(prev => [...prev, msg]);
        }, delay);
        timers.push(t);
      });
      setChatTimers(timers);
      return () => {
        clearTimeout(videoTimer);
        timers.forEach(t => clearTimeout(t));
      };
    }
  }, [showLiveModal]);

  if (!workshop) {
    return (
      <div className="student-workshop-page">
        <TopBar showSearch={false} />
        <div className="not-found">Workshop not found.</div>
      </div>
    );
  }

  // UI for each status
  const renderActions = () => {
    switch (workshop.status) {
      case 'unregistered':
        return (
          <button className="iv-btn primary" onClick={() => handleRegister(workshop.id)}>
            Register for Workshop
          </button>
        );
      case 'soon':
        return <div className="registered-msg">You are registered for this workshop.</div>;
      case 'live':
        return (
          <button className="iv-btn primary" onClick={handleJoinLive}>
            Join Live Workshop
          </button>
        );
      case 'pre-recorded':
        return (
          <button className="iv-btn primary" onClick={handleWatchRecording}>
            Watch Recording
          </button>
        );
      case 'concluded':
        return (
          <>
            <div className="feedback-section">
              <button className="iv-btn primary" onClick={handleFeedback}>
                Give Feedback & Download Certificate
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Handlers (to be implemented)
  const handleRegister = (workshopId) => {
    // Update in sessionStorage and local state
    const stored = sessionStorage.getItem('workshops');
    let workshopsArr = [];
    if (stored) {
      workshopsArr = JSON.parse(stored);
    } else {
      workshopsArr = mockWorkshops.workshops;
    }
    const updatedArr = workshopsArr.map(w =>
      w.id === workshopId ? { ...w, status: 'soon', type: 'upcoming' } : w
    );
    sessionStorage.setItem('workshops', JSON.stringify(updatedArr));
    const updated = updatedArr.find(w => w.id === workshopId);
    setWorkshop(updated);
  };

  // Notes logic
  const handleAddNote = () => {
    if (noteInput.trim()) {
      setNotes(prev => [...prev, noteInput.trim()]);
      setNoteInput('');
    }
  };

  // Chat logic
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      setChatMessages(prev => [...prev, { name: 'You', message: chatInput.trim() }]);
      setChatInput('');
    }
  };

  const handleJoinLive = () => {
    setShowLiveModal(true);
  };
  const handleWatchRecording = () => {
    setShowRecordingModal(true);
  };
  const handleEndCall = () => {
    setShowLiveModal(false);
    setShowFeedback(true);
    setVideoEnded(false);
    setNotes([]);
    setNoteInput('');
    setChatInput('');
    setChatMessages([]);
    chatTimers.forEach(t => clearTimeout(t));
    setChatTimers([]);
  };
  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    // Update workshop to concluded and store feedback
    const stored = sessionStorage.getItem('workshops');
    let workshopsArr = [];
    if (stored) {
      workshopsArr = JSON.parse(stored);
    } else {
      workshopsArr = mockWorkshops.workshops;
    }
    const updatedArr = workshopsArr.map(w =>
      w.id === workshop.id
        ? { ...w, status: 'concluded', feedback: feedback, rating: feedbackRating }
        : w
    );
    sessionStorage.setItem('workshops', JSON.stringify(updatedArr));
    const updated = updatedArr.find(w => w.id === workshop.id);
    setWorkshop(updated);
    setShowFeedback(false);
    setFeedbackGiven(true);
    // Optionally reset feedback fields
    setFeedback('');
    setFeedbackRating(0);
  };

  const handleFeedback = () => {
    setShowFeedback(true);
  };

  const handleAddRecordingNote = () => {
    if (recordingNoteInput.trim()) {
      setRecordingNotes(prev => [...prev, recordingNoteInput.trim()]);
      setRecordingNoteInput('');
    }
  };

  // Certificate download
  const handleDownloadCertificate = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('Workshop Certificate', 20, 30);
    doc.setFontSize(16);
    doc.text(`This certifies that`, 20, 50);
    doc.setFontSize(18);
    doc.text('Student Name: Yahia Hesham', 20, 65);
    doc.setFontSize(16);
    doc.text(`has successfully completed the workshop:`, 20, 80);
    doc.setFontSize(18);
    doc.text(workshop.name, 20, 95);
    doc.setFontSize(16);
    doc.text(`Date: ${workshop.startDate}`, 20, 110);
    doc.text(`Rating: ${workshop.rating || ''} star(s)`, 20, 120);
    if (workshop.feedback) {
      doc.text('Feedback:', 20, 135);
      doc.setFontSize(14);
      doc.text(doc.splitTextToSize(workshop.feedback, 170), 20, 145);
    }
    doc.save('certificate.pdf');
  };

  if (workshop.status === 'concluded') {
    return (
      <div className="student-workshop-page">
        <TopBar showSearch={false}>
          <button className="iv-btn secondary" onClick={() => navigate(-1)}>
            Back
          </button>
        </TopBar>
        <div className="workshop-details-container">
          <h1>{workshop.name}</h1>
          <div className="workshop-meta">
            <span><strong>Date:</strong> {workshop.startDate} {workshop.startTime} - {workshop.endDate} {workshop.endTime}</span>
          </div>
          <div className="workshop-section">
            <h3>Short Description</h3>
            <p>{workshop.shortDescription}</p>
          </div>
          <div className="workshop-section">
            <h3>Speaker Bio</h3>
            <p>{workshop.speakerBio}</p>
          </div>
          <div className="workshop-section">
            <h3>Agenda</h3>
            <pre className="workshop-agenda">{workshop.agenda}</pre>
          </div>
          <div className="workshop-section">
            <h3>Your Feedback</h3>
            <div style={{display:'flex',alignItems:'center',gap:'0.7rem',marginBottom:'0.5rem'}}>
              {[1,2,3,4,5].map(star => (
                <FaStar key={star} color={workshop.rating >= star ? '#ffc107' : '#e4e5e9'} />
              ))}
              <span style={{fontWeight:600}}>{workshop.rating} / 5</span>
            </div>
            <div style={{background:'#f8fafc',borderRadius:'8px',padding:'1rem',color:'#333',maxWidth:'600px'}}>
              {workshop.feedback}
            </div>
          </div>
          <div className="workshop-section" style={{textAlign:'right'}}>
            <button className="iv-btn primary" onClick={handleDownloadCertificate}>
              Download Certificate (PDF)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-workshop-page">
      <TopBar showSearch={false}>
        <button className="iv-btn secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </TopBar>
      <div className="workshop-details-container">
        <h1>{workshop.name}</h1>
        <div className="workshop-meta">
          <span><strong>Date:</strong> {workshop.startDate} {workshop.startTime} - {workshop.endDate} {workshop.endTime}</span>
        </div>
        <div className="workshop-section">
          <h3>Short Description</h3>
          <p>{workshop.shortDescription}</p>
        </div>
        <div className="workshop-section">
          <h3>Speaker Bio</h3>
          <p>{workshop.speakerBio}</p>
        </div>
        <div className="workshop-section">
          <h3>Agenda</h3>
          <pre className="workshop-agenda">{workshop.agenda}</pre>
        </div>
        <div className="workshop-actions-row">
          {renderActions()}
        </div>
      </div>
      {/* Live Workshop Modal */}
      <LiveModal isOpen={showLiveModal} onClose={handleEndCall} title="Live Workshop Session">
        <div className="live-modal-split">
          {/* Left: Video + End Call */}
          <div className="live-modal-left">
            {!videoEnded ? (
              <video
                src={require('../assets/videos/student-call.mp4')}
                autoPlay
                controls={false}
                muted
                className="live-instructor-video"
              />
            ) : (
              <div className="instructor-left-msg">
                The instructor has left the session.
              </div>
            )}
            <div className="end-call-btn-row">
              <button className="iv-btn primary end-call-btn" onClick={handleEndCall}>
                <img src={endCallIcon} alt="End Call" style={{width:'38px',height:'38px'}} />
              </button>
            </div>
          </div>
          {/* Right: Notes + Chat */}
          <div className="live-modal-right">
            {/* Notes Section */}
            <div className="live-notes-section">
              <label htmlFor="live-notes">Notes</label>
              <div className="notes-input-row">
                <input
                  id="live-notes"
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  placeholder="Write a note..."
                />
                <button className="iv-btn" type="button" onClick={handleAddNote}>Add Note</button>
              </div>
              <ul className="notes-list">
                {notes.map((n,i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
            {/* Live Chat Section */}
            <div className="live-chat-section">
              <div className="chat-messages">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={msg.name === 'You' ? 'chat-msg self' : 'chat-msg'}>
                    <span className="chat-name">{msg.name}:</span>
                    <span className="chat-text">{msg.message}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="chat-input-row">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  disabled={videoEnded}
                />
                <button className="iv-btn primary" type="submit" disabled={videoEnded}>Send</button>
              </form>
            </div>
          </div>
        </div>
      </LiveModal>
      {/* Recording Modal */}
      <LiveModal isOpen={showRecordingModal} onClose={() => setShowRecordingModal(false)} title="Workshop Recording">
        <div className="live-modal-split">
          {/* Left: Video */}
          <div className="live-modal-left">
            <video
              src={require('../assets/videos/student-call.mp4')}
              controls
              className="live-instructor-video"
              style={{background:'#111'}}
            />
          </div>
          {/* Right: Notes + Feedback */}
          <div className="live-modal-right">
            {/* Notes Section */}
            <div className="live-notes-section">
              <label htmlFor="recording-notes">Notes</label>
              <div className="notes-input-row">
                <input
                  id="recording-notes"
                  value={recordingNoteInput}
                  onChange={e => setRecordingNoteInput(e.target.value)}
                  placeholder="Write a note..."
                />
                <button className="iv-btn" type="button" onClick={handleAddRecordingNote}>Add Note</button>
              </div>
              <ul className="notes-list">
                {recordingNotes.map((n,i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
            {/* Feedback Button */}
            <div style={{marginTop:'2rem', textAlign:'right'}}>
              <button className="iv-btn primary" onClick={() => { setShowRecordingModal(false); setShowFeedback(true); }}>
                Give Feedback
              </button>
            </div>
          </div>
        </div>
      </LiveModal>
      {/* Feedback Modal (no close button) */}
      <Modal isOpen={showFeedback} onClose={null} title="Workshop Feedback" hideClose>
        <form onSubmit={handleSubmitFeedback} className="feedback-form">
          <label htmlFor="feedback">How was your experience?</label>
          <div className="star-rating-row" style={{marginBottom:'1rem', fontSize:'2rem', color:'#ffc107', display:'flex', gap:'0.3rem'}}>
            {[1,2,3,4,5].map(star => (
              <FaStar
                key={star}
                onClick={() => setFeedbackRating(star)}
                style={{cursor:'pointer'}}
                color={feedbackRating >= star ? '#ffc107' : '#e4e5e9'}
                title={star + ' star' + (star > 1 ? 's' : '')}
              />
            ))}
          </div>
          <textarea
            id="feedback"
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="Share your feedback..."
            style={{ width: '100%', minHeight: '80px', marginBottom: '1rem' }}
            required
          />
          <button className="iv-btn primary" type="submit">Submit Feedback</button>
        </form>
      </Modal>
    </div>
  );
};

export default StudentWorkshop; 