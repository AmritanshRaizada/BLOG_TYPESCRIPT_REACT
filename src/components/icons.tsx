import { FaSpinner, FaRegFileAlt } from 'react-icons/fa'; // or any icon library you prefer

export const Icons = {
  spinner: (props: React.SVGProps<SVGSVGElement>) => (
    <FaSpinner {...props} className={`animate-spin ${props.className || ''}`} />
  ),
  post: (props: React.SVGProps<SVGSVGElement>) => (
    <FaRegFileAlt {...props} />
  ),
};
