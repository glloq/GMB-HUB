import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/flash.css';
import './styles/media.css';
import './styles/theme.css';
import './styles/capabilities.css';
import './styles/compact.css';
import { mountApp } from './app';

mountApp(document.querySelector<HTMLDivElement>('#app'));
