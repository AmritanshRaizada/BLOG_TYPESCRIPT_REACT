import React from 'react';
import {
  FacebookShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  EmailShareButton,
} from 'react-share';
import {
  FacebookIcon,
  WhatsappIcon,
  LinkedinIcon,
  EmailIcon,
} from 'react-share';

interface ShareCardProps {
  url: string;
  onClose: () => void;
}

const ShareCard: React.FC<ShareCardProps> = ({ url, onClose }) => {
  return (
    <div className="absolute top-80 right-0 mt-12 mr-4 bg-white border border-gray-200 rounded-lg shadow-md z-50 p-4 w-60">
      <div className="flex justify-end mb-2">
        <button onClick={onClose} className="text-gray-500 hover:text-black text-sm">
          ✕ Close
        </button>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <WhatsappShareButton url={url}><WhatsappIcon size={32} round /></WhatsappShareButton>
        <LinkedinShareButton url={url}><LinkedinIcon size={32} round /></LinkedinShareButton>
        <EmailShareButton url={url}><EmailIcon size={32} round /></EmailShareButton>
        <FacebookShareButton url={url}><FacebookIcon size={32} round /></FacebookShareButton>
      </div>
    </div>
  );
};

export default ShareCard;