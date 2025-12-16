// src/components/proj/Chatroom.jsx
import { useState, useEffect, useRef, useMemo } from 'react';
import { db, auth } from '../../firebase.js';
import { 
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import './chatroom.css';

export default function Chatroom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [availableChats, setAvailableChats] = useState([]); // [{ uid, email }]
  const [loadingChats, setLoadingChats] = useState(true);

  const currentUser = auth.currentUser;
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Build deterministic chatroom id
  const getChatroomId = (u1, u2) => [u1.uid, u2.uid].sort().join('_');

  // Load available chats for current user based on chatrooms the user participates in.
  // We expect a "participants" array field on each chatroom doc containing both UIDs,
  // and we also store participant profiles for convenience.
  const loadAvailableChats = async () => {
    if (!currentUser) return;
    setLoadingChats(true);
    try {
      const chatroomsRef = collection(db, 'chatrooms');
      const qRooms = query(chatroomsRef, where('participants', 'array-contains', currentUser.uid));
      const snap = await getDocs(qRooms);

      const partners = new Map(); // uid -> { uid, email }
      // Each chatroom doc should have a participantsProfiles: { [uid]: { uid, email } }
      snap.forEach((roomDoc) => {
        const data = roomDoc.data() || {};
        const profiles = data.participantsProfiles || {};
        Object.values(profiles).forEach((prof) => {
          if (prof.uid && prof.uid !== currentUser.uid) {
            // prefer stored email if present
            partners.set(prof.uid, { uid: prof.uid, email: prof.email || '' });
          }
        });
        // Fallback: if profiles missing, infer from id
        if ((!data.participantsProfiles || Object.keys(data.participantsProfiles).length === 0) && roomDoc.id.includes('_')) {
          const [a, b] = roomDoc.id.split('_');
          const partnerUid = a === currentUser.uid ? b : (b === currentUser.uid ? a : null);
          if (partnerUid) partners.set(partnerUid, { uid: partnerUid, email: '' });
        }
      });

      // If any partner email is missing, fetch from users collection
      const needLookup = [...partners.values()].filter(p => !p.email);
      if (needLookup.length > 0) {
        const usersRef = collection(db, 'users');
        // Firestore doesn't support IN with more than 10 items; chunk if needed
        const chunk = (arr, size) => arr.length <= size ? [arr] : Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, (i + 1) * size));
        const chunks = chunk(needLookup.map(p => p.uid), 10);
        for (const c of chunks) {
          const qUsers = query(usersRef, where('uid', 'in', c));
          const usersSnap = await getDocs(qUsers);
          usersSnap.forEach(d => {
            const u = d.data();
            if (u?.uid) {
              partners.set(u.uid, { uid: u.uid, email: u.email || '' });
            }
          });
        }
      }

      setAvailableChats([...partners.values()].sort((x, y) => (x.email || '').localeCompare(y.email || '')));
    } catch (e) {
      console.error('Failed to load available chats', e);
    } finally {
      setLoadingChats(false);
    }
  };

  // Search by exact email
  const searchUsers = async () => {
    if (!searchEmail.trim()) {
      setSearchResults([]);
      return;
    }
    const q = query(
      collection(db, 'users'),
      where('email', '==', searchEmail.trim().toLowerCase())
    );
    const snapshot = await getDocs(q);
    const results = snapshot.docs
      .map(doc => doc.data())
      .filter(u => u.uid !== currentUser.uid);
    setSearchResults(results);
    if (results.length === 0) alert('No user found with that email');
  };

  const handleKeyPress = (e) => e.key === 'Enter' && searchUsers();

  // Load chats when user is available
  useEffect(() => {
    if (!currentUser) return;
    loadAvailableChats();
  }, [currentUser]);

  // Subscribe messages for selected chat
  useEffect(() => {
    if (!selectedUser) {
      setMessages([]);
      return;
    }
    const chatId = getChatroomId(currentUser, selectedUser);
    const qMsg = query(collection(db, 'chatrooms', chatId, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(qMsg, snap => {
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [selectedUser, currentUser]);

  const ensureChatroomDoc = async (u1, u2) => {
    const chatId = getChatroomId(u1, u2);
    const chatDocRef = doc(db, 'chatrooms', chatId);
    const existing = await getDoc(chatDocRef);
    const participantsProfiles = {
      [u1.uid]: { uid: u1.uid, email: u1.email || '' },
      [u2.uid]: { uid: u2.uid, email: u2.email || '' },
    };
    if (!existing.exists()) {
      await setDoc(chatDocRef, {
        participants: [u1.uid, u2.uid],
        participantsProfiles,
        createdAt: serverTimestamp(),
        lastMessageAt: null,
        lastMessagePreview: '',
      }, { merge: true });
    } else {
      // Merge in case missing fields
      await setDoc(chatDocRef, {
        participants: [u1.uid, u2.uid],
        participantsProfiles,
      }, { merge: true });
    }
    return chatId;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedUser) return;

    const chatId = await ensureChatroomDoc(currentUser, selectedUser);

    const msgRef = await addDoc(collection(db, 'chatrooms', chatId, 'messages'), {
      content: input,
      senderUid: currentUser.uid,
      senderEmail: currentUser.email,
      timestamp: serverTimestamp(),
    });

    // Update chatroom meta
    await setDoc(doc(db, 'chatrooms', chatId), {
      lastMessageAt: serverTimestamp(),
      lastMessagePreview: input.slice(0, 200),
    }, { merge: true });

    setInput('');
    // Refresh available chats list (e.g., if this is a new thread)
    loadAvailableChats();
    return msgRef;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/proj/login');
  };

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData) => {
    setInput(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Derived list to show on sidebar: if there are search results, show those, else show available chats
  const sidebarList = useMemo(() => {
    return (searchResults.length > 0 ? searchResults : availableChats);
  }, [searchResults, availableChats]);

  const sidebarEmptyMessage = useMemo(() => {
    if (searchResults.length > 0) return null;
    if (loadingChats) return 'Loading chats...';
    if (availableChats.length === 0) return 'No existing chats. Type an email and press Enter to start one.';
    return null;
  }, [searchResults, loadingChats, availableChats]);

  return (
    <div className="chatroom-container">
      <div className="chatroom-header">
        <h1>Chatroom</h1>
        <p>
          Logged in as: {currentUser?.email}{' '}
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </p>
      </div>

      <div className="chatroom">
        <div className="chatroom-sidebar">
          <div className="sidebar-search">
            <input
              type="email"
              placeholder="Enter email and press Enter"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="search-btn" onClick={searchUsers}>Search</button>
          </div>

          <div className="chatroom-selection">
            {sidebarList.length > 0 ? (
              sidebarList.map(user => (
                <div
                  key={user.uid}
                  className={`user-item ${selectedUser?.uid === user.uid ? 'active' : ''}`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="user-item-name">{(user.email || user.uid).split('@')[0]}</div>
                  <div className="user-item-email">{user.email || user.uid}</div>
                </div>
              ))
            ) : (
              <div className="no-results">
                {sidebarEmptyMessage || 'Type an email and press Enter to search'}
              </div>
            )}
          </div>
        </div>

        <div className="chat-main">
          {selectedUser ? (
            <>
              <div className="chat-header">
                Chatting with {(selectedUser.email || selectedUser.uid).split('@')[0]}
              </div>
              <div className="messages-area">
                {messages.map(msg => (
                  <div key={msg.id} className={`message ${msg.senderUid === currentUser.uid ? 'sent' : 'received'}`}>
                    <div className="message-bubble">{msg.content}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendMessage} className="message-input-form">
                <div className="message-input-wrapper">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="message-input"
                    onFocus={() => setShowEmojiPicker(false)}
                  />

                  <button
                    type="button"
                    className="emoji-toggle-btn"
                    onClick={() => setShowEmojiPicker(prev => !prev)}
                    aria-label="Emoji picker"
                  >☺</button>

                  {showEmojiPicker && (
                    <div className="emoji-picker-popup">
                      <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        theme="light"
                        width={350}
                        height={400}
                        emojiStyle="native"
                      />
                    </div>
                  )}
                </div>

                <button type="submit" className="send-btn" disabled={!input.trim()}>
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="no-chat">
              <h2>No chat selected</h2>
              <p>Select a conversation from the left or search for a user to start messaging.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}