import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Heart, Share2, Music, Headphones, Star, TrendingUp, Volume2 } from 'lucide-react';
import './App.css';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  genre: string;
  isLiked: boolean;
  plays: number;
  coverColor: string;
  audioUrl: string;
}

interface PlaylistCardProps {
  title: string;
  trackCount: number;
  gradient: string;
  icon: React.ReactNode;
}

const App: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'discover' | 'trending' | 'liked'>('discover');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sampleTracks: Track[] = [
    {
      id: '1',
      title: 'Ye',
      artist: 'Burna Boy',
      album: 'Outside',
      duration: '4:13',
      genre: 'Afrobeats',
      isLiked: false,
      plays: 4500000,
      coverColor: 'green-yellow',
      audioUrl: 'public/audio/Burna Boy - Ye [Official Audio].mp3'
    },
    {
      id: '2',
      title: 'Touch it',
      artist: 'KiDi',
      album: 'Golden Boy',
      duration: '3:02',
      genre: 'Afrobeats/Highlife',
      isLiked: true,
      plays: 3500000,
      coverColor: 'golden-purple',
      audioUrl: 'public/audio/KiDi - Touch It (Lyrics) _ shut up and bend over song.mp3'
    },
    {
      id: '3',
      title: 'Essence',
      artist: 'Wizkid Ft. Tems',
      album: 'Made in Lagos',
      duration: '4:10',
      genre: 'Afrobeats',
      isLiked: false,
      plays: 12000000,
      coverColor: 'orange-brown',
      audioUrl: 'public/audio/Wizkid - Essence (Audio) ft. Tems.mp3'
    },
    {
      id: '4',
      title: 'Fall',
      artist: 'Davido',
      album: 'A Good Time',
      duration: '3:55',
      genre: 'AfroPop',
      isLiked: true,
      plays: 15600000,
      coverColor: 'red-gold',
      audioUrl: 'public/audio/Davido - Fall (official version).mp3'
    },
    {
      id: '5',
      title: 'Aben Wo Ha',
      artist: 'Daddy Lumba',
      album: 'Aben Wo Ha',
      duration: '4:37',
      genre: 'Highlife',
      isLiked: true,
      plays: 178000000,
      coverColor: 'blue-gold',
      audioUrl: 'public/audio/Daddy Lumba - Aben Wo Ha (GHANA CLASSICS).mp3'
    },
    {
      id: '6',
      title: 'Theresa',
      artist: 'Daddy Lumba',
      album: 'Theresa',
      duration: '5:10',
      genre: 'Highlife',
      isLiked: true,
      plays: 950000000,
      coverColor: 'green-gold',
      audioUrl: 'public/audio/Daddy Lumba - Theresa (Audio Slide).mp3'
    }
  ];

  const playlists = [
    { title: 'Discover Weekly', trackCount: 30, gradient: 'green-blue', icon: <TrendingUp size={24} /> },
    { title: 'Chill Vibes', trackCount: 42, gradient: 'purple-pink', icon: <Headphones size={24} /> },
    { title: 'Workout Mix', trackCount: 28, gradient: 'red-orange', icon: <Star size={24} /> },
    { title: 'Late Night', trackCount: 35, gradient: 'indigo-purple', icon: <Music size={24} /> }
  ];

  // Audio functionality
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  const togglePlay = (trackId: string) => {
    const track = sampleTracks.find(t => t.id === trackId);
    if (!track) return;

    if (currentTrack === trackId && isPlaying) {
      // Pause current track
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Start new track
      audioRef.current = new Audio(track.audioUrl);
      audioRef.current.volume = volume;
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        alert('Could not play audio. Make sure the audio file exists in public/audio/ folder.');
      });
      
      setCurrentTrack(trackId);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleLike = (trackId: string) => {
    const newLikedTracks = new Set(likedTracks);
    if (newLikedTracks.has(trackId)) {
      newLikedTracks.delete(trackId);
    } else {
      newLikedTracks.add(trackId);
    }
    setLikedTracks(newLikedTracks);
  };

  const formatPlays = (plays: number): string => {
    if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
    if (plays >= 1000) return `${(plays / 1000).toFixed(1)}K`;
    return plays.toString();
  };

  const PlaylistCard: React.FC<PlaylistCardProps> = ({ title, trackCount, gradient, icon }) => (
    <div className={`playlist-card ${gradient}`}>
      <div className="playlist-header">
        {icon}
        <div className="track-count">
          <div>{trackCount} tracks</div>
        </div>
      </div>
      <h3 className="playlist-title">{title}</h3>
    </div>
  );

  const TrackItem: React.FC<{ track: Track }> = ({ track }) => (
    <div className="track-item">
      <div 
        className={`track-cover ${track.coverColor}`}
        onClick={() => togglePlay(track.id)}
      >
        {currentTrack === track.id && isPlaying ? (
          <Pause className="play-icon" size={20} />
        ) : (
          <Play className="play-icon" size={20} />
        )}
      </div>
      
      <div className="track-info">
        <h4 className="track-title">{track.title}</h4>
        <p className="track-artist">{track.artist} • {track.album}</p>
        <div className="track-meta">
          <span className="genre-tag">{track.genre}</span>
          <span className="play-count">{formatPlays(track.plays)} plays</span>
        </div>
      </div>
      
      <div className="track-actions">
        <span className="duration">{track.duration}</span>
        <button
          onClick={() => toggleLike(track.id)}
          className={`like-btn ${likedTracks.has(track.id) ? 'liked' : ''}`}
        >
          <Heart size={18} fill={likedTracks.has(track.id) ? 'currentColor' : 'none'} />
        </button>
        <button className="share-btn">
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );

  const getFilteredTracks = () => {
    switch (activeTab) {
      case 'trending':
        return [...sampleTracks].sort((a, b) => b.plays - a.plays);
      case 'liked':
        return sampleTracks.filter(track => likedTracks.has(track.id));
      default:
        return sampleTracks;
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <Music size={20} />
            </div>
            <h1 className="app-title">SoundWave</h1>
          </div>
          
          <nav className="nav-tabs">
            {[
              { key: 'discover', label: 'Discover', icon: <Music size={16} /> },
              { key: 'trending', label: 'Trending', icon: <TrendingUp size={16} /> },
              { key: 'liked', label: 'Liked', icon: <Heart size={16} /> }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`nav-tab ${activeTab === key ? 'active' : ''}`}
              >
                {icon}
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <h2 className="hero-title">
            Discover Your
            <span className="gradient-text"> Sound</span>
          </h2>
          <p className="hero-subtitle">
            Explore millions of tracks, create playlists, and find your next favorite song
          </p>
        </section>

        {/* Stats */}
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-number">2.1M+</div>
            <div className="stat-label">Tracks Played</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">450K+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">98%</div>
            <div className="stat-label">User Satisfaction</div>
          </div>
        </section>

        {/* Playlists */}
        <section className="playlists-section">
          <h3 className="section-title">Featured Playlists</h3>
          <div className="playlists-grid">
            {playlists.map((playlist, index) => (
              <PlaylistCard key={index} {...playlist} />
            ))}
          </div>
        </section>

        {/* Tracks */}
        <section className="tracks-section">
          <div className="tracks-header">
            <h3 className="section-title">
              {activeTab === 'discover' && 'Discover New Music'}
              {activeTab === 'trending' && 'Trending Now'}
              {activeTab === 'liked' && `Liked Songs (${likedTracks.size})`}
            </h3>
            <div className="track-count">
              {getFilteredTracks().length} tracks
            </div>
          </div>

          <div className="tracks-list">
            {getFilteredTracks().map((track) => (
              <TrackItem key={track.id} track={track} />
            ))}
            
            {activeTab === 'liked' && likedTracks.size === 0 && (
              <div className="empty-state">
                <Heart className="empty-icon" size={48} />
                <h4 className="empty-title">No liked songs yet</h4>
                <p className="empty-subtitle">Start exploring and like your favorite tracks!</p>
              </div>
            )}
          </div>
        </section>

        {/* Now Playing Bar */}
        {currentTrack && (
          <div className="now-playing">
            <div className="now-playing-content">
              <div className="current-track-info">
                <div className={`current-track-cover ${sampleTracks.find(t => t.id === currentTrack)?.coverColor}`}>
                  <Music size={20} />
                </div>
                <div className="current-track-details">
                  <h4 className="current-track-title">
                    {sampleTracks.find(t => t.id === currentTrack)?.title}
                  </h4>
                  <p className="current-track-artist">
                    {sampleTracks.find(t => t.id === currentTrack)?.artist}
                  </p>
                </div>
              </div>
              
              <div className="playback-controls">
                <button
                  onClick={() => togglePlay(currentTrack)}
                  className="play-button"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
              </div>

              <div className="audio-controls">
                <div className="progress-container">
                  <span className="time-display">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="progress-bar"
                  />
                  <span className="time-display">{formatTime(duration)}</span>
                </div>
                
                <div className="volume-container">
                  <Volume2 size={16} />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;