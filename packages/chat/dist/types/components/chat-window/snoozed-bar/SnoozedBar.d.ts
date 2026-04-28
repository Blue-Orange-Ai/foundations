import { FC } from 'react';
import { IChatUser } from '../../../interfaces/ChatInterfaces';
import './SnoozedBar.css';
interface SnoozedBarProps {
    snoozedUsers: IChatUser[];
}
export declare const SnoozedBar: FC<SnoozedBarProps>;
export {};
