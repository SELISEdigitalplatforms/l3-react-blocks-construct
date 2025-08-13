import React, { useState } from 'react';
import {
  X,
  Download,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Image as ImageIcon,
  Video as VideoIcon,
  Music,
} from 'lucide-react';
import { IFileTrashData } from '../utils/file-manager';

interface PreviewProps {
  file: IFileTrashData;
  onClose: () => void;
  t: (key: string) => string;
}

// Image Preview Component
const ImagePreview: React.FC<PreviewProps> = ({ file, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.25));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  // Generate a placeholder image URL based on file name
  const getPlaceholderImage = (fileName: string) => {
    const colors = ['ff6b6b', '4ecdc4', '45b7d1', '96ceb4', 'feca57', 'ff9ff3'];
    const colorIndex = fileName.length % colors.length;
    return `https://via.placeholder.com/800x600/${colors[colorIndex]}/ffffff?text=${encodeURIComponent(fileName.split('.')[0])}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black bg-opacity-50 text-white">
          <div className="flex items-center space-x-3">
            <ImageIcon className="w-5 h-5" />
            <div>
              <h3 className="font-medium">{file.name}</h3>
              <p className="text-sm text-gray-300">{file.size}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm px-2">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleRotate}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1 text-sm hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          <img
            src={getPlaceholderImage(file.name)}
            alt={file.name}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Video Preview Component
const VideoPreview: React.FC<PreviewProps> = ({ file, onClose }) => {
  // Generate placeholder video URL
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getPlaceholderVideo = (fileName: string) => {
    return `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black bg-opacity-50 text-white max-w-4xl">
          <div className="flex items-center space-x-3 ">
            <VideoIcon className="w-5 h-5" />
            <div>
              <h3 className="font-medium">{file.name}</h3>
              <p className="text-sm text-gray-300">{file.size}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors bg-background text-high-emphasis"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Container */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <video
              className="w-full h-auto rounded-lg"
              poster={`https://via.placeholder.com/800x450/2c3e50/ffffff?text=${encodeURIComponent(file.name.split('.')[0])}`}
              controls
            >
              <source src={getPlaceholderVideo(file.name)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};

// Audio Preview Component
const AudioPreview: React.FC<PreviewProps> = ({ file, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime] = useState(0);
  const [duration] = useState(180); // Mock duration

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleMute = () => setIsMuted(!isMuted);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Music className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="font-medium text-gray-900">{file.name}</h3>
              <p className="text-sm text-gray-500">{file.size}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Audio Visualization */}
        <div className="flex items-center justify-center h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-6">
          <div className="flex items-end space-x-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`bg-white rounded-full transition-all duration-300 ${
                  isPlaying ? 'animate-pulse' : ''
                }`}
                style={{
                  width: '3px',
                  height: `${Math.random() * 40 + 10}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <span>{formatTime(currentTime)}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Play Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handleMute}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={handlePlayPause}
              className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Document Preview Component
const DocumentPreview: React.FC<PreviewProps> = ({ file, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // Mock total pages

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📋';
      default:
        return '📄';
    }
  };

  const generateMockContent = () => {
    return `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      
      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
    `;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getFileIcon(file.name)}</span>
            <div>
              <h3 className="font-medium text-gray-900">{file.name}</h3>
              <p className="text-sm text-gray-500">{file.size}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto">
            <div className="prose prose-sm max-w-none">
              <h2 className="text-xl font-bold mb-4">Document Preview - Page {currentPage}</h2>
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {generateMockContent()}
              </div>
              {currentPage > 1 && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    This is additional content for page {currentPage}. Each page contains different
                    sections of the document.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main File Preview Component
interface FilePreviewProps {
  file: IFileTrashData | null;
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, isOpen, onClose, t }) => {
  if (!isOpen || !file || file.fileType === 'Folder') {
    return null;
  }

  const commonProps = { file, onClose, t };

  switch (file.fileType) {
    case 'Image':
      return <ImagePreview {...commonProps} />;
    case 'Video':
      return <VideoPreview {...commonProps} />;
    case 'Audio':
      return <AudioPreview {...commonProps} />;
    case 'File':
      return <DocumentPreview {...commonProps} />;
    default:
      return null;
  }
};
