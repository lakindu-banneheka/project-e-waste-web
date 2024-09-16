import Image from 'next/image';
import darkLogo from './ewaste_logo-dark.webp'; 
import lightLogo from './ewaste_logo 1.png'; 
import { useTheme } from 'next-themes';

interface LogoImageProps {
  width?: number | `${number}` | undefined; 
  height?: number | `${number}` | undefined; 
  alt?: string; 
  className?: string; 
}

const LogoImage: React.FC<LogoImageProps> = ({
  width, 
  height, 
  alt = 'Logo', 
  className = '', 
}) => {
  const { theme } = useTheme();

  return (
    <Image
      src={theme === 'dark' ? darkLogo : lightLogo}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default LogoImage;
