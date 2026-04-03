import { motion, AnimatePresence } from 'motion/react';
import { Phone, PhoneOff, User, Search, Plus, MessageSquare, Clock, Star, MoreVertical, Mic, Volume2, Video } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Contact {
  id: string;
  name: string;
  relation: string;
  number: string;
  avatar?: string;
  isFavorite?: boolean;
}

export function PhoneInterface() {
  const [contacts] = useState<Contact[]>([
    { id: '1', name: 'Mother', relation: 'Family', number: '+1 (555) 012-3456', isFavorite: true },
    { id: '2', name: 'Mr Wesonga', relation: 'Creator', number: '+1 (555) 987-6543', isFavorite: true },
    { id: '3', name: 'Mr Moses', relation: 'Creator', number: '+1 (555) 456-7890', isFavorite: true },
    { id: '4', name: 'Kaloleni JSS', relation: 'Organization', number: '+1 (555) 111-2222' },
  ]);

  const [activeCall, setActiveCall] = useState<Contact | null>(null);
  const [callStatus, setCallStatus] = useState<'dialing' | 'connected' | 'ended'>('dialing');
  const [callDuration, setCallDuration] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeCall && callStatus === 'connected') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeCall, callStatus]);

  const handleCall = (contact: Contact) => {
    setActiveCall(contact);
    setCallStatus('dialing');
    setCallDuration(0);
    
    // Simulate connection
    setTimeout(() => {
      setCallStatus('connected');
    }, 2500);
  };

  const endCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      setActiveCall(null);
    }, 1500);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.relation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col bg-white overflow-hidden relative">
      {/* Header */}
      <div className="p-6 border-b bg-slate-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
              <Phone size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Communications</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nova AI // Phone Module</p>
            </div>
          </div>
          <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
            <Plus size={20} />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search contacts or relations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
        {searchQuery === '' && (
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Favorites</h3>
            <div className="grid grid-cols-2 gap-3">
              {contacts.filter(c => c.isFavorite).map(contact => (
                <button 
                  key={contact.id}
                  onClick={() => handleCall(contact)}
                  className="flex flex-col items-center p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50 hover:border-blue-100 transition-all group"
                >
                  <div className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <User size={24} className="text-slate-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">{contact.name}</span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest">{contact.relation}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">
            {searchQuery ? 'Search Results' : 'All Contacts'}
          </h3>
          <div className="space-y-2">
            {filteredContacts.map(contact => (
              <div 
                key={contact.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <User size={20} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{contact.name}</p>
                    <p className="text-[10px] text-slate-500">{contact.number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleCall(contact)}
                    className="h-8 w-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-all"
                  >
                    <Phone size={16} />
                  </button>
                  <button className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
                    <MessageSquare size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Call Overlay */}
      <AnimatePresence>
        {activeCall && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-between p-12 text-white"
          >
            <div className="text-center mt-12">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="h-32 w-32 rounded-full bg-slate-800 border-2 border-blue-500/30 flex items-center justify-center mx-auto mb-6 relative"
              >
                <User size={64} className="text-slate-400" />
                {callStatus === 'dialing' && (
                  <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping opacity-20" />
                )}
              </motion.div>
              <h3 className="text-3xl font-bold mb-2">{activeCall.name}</h3>
              <p className="text-blue-400 uppercase tracking-[0.3em] text-xs font-bold">
                {callStatus === 'dialing' ? 'Calling...' : callStatus === 'ended' ? 'Call Ended' : formatDuration(callDuration)}
              </p>
            </div>

            <div className="w-full max-w-xs space-y-12">
              <div className="grid grid-cols-3 gap-8">
                {[
                  { icon: Mic, label: 'Mute' },
                  { icon: Volume2, label: 'Speaker' },
                  { icon: Video, label: 'Video' },
                ].map((btn, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <button className="h-14 w-14 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-all">
                      <btn.icon size={24} />
                    </button>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">{btn.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={endCall}
                  className="h-20 w-20 rounded-full bg-red-600 flex items-center justify-center shadow-xl shadow-red-900/40 hover:bg-red-500 transition-all active:scale-95"
                >
                  <PhoneOff size={32} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
