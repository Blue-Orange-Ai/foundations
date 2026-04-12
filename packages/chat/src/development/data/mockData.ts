import { UserState } from '@blue-orange-ai/foundations-clients';
import {
    IChatUser,
    IChatMessage,
    IChatConversation,
    IChatGroup,
    ChatConversationType,
    ChatUserStatus
} from '../../interfaces/ChatInterfaces';

// -- Helper to build dates relative to now --

const now = new Date();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60_000);
const hoursAgo = (h: number) => minutesAgo(h * 60);
const daysAgo = (d: number) => hoursAgo(d * 24);

// -- Mock Users (diverse statuses) --

const baseUser = {
    avatar: undefined,
    telephone: undefined,
    address: undefined,
    created: daysAgo(90),
    lastActive: now,
    state: UserState.ACTIVE,
    forcePasswordReset: false,
    domain: 'blue-orange.ai',
    notes: '',
    serviceUser: false,
    defaultUser: false,
    emailVerified: true,
    phoneVerified: false,
    addressVerified: false,
};

export const currentUser: IChatUser = {
    user: { ...baseUser, id: 'u1', name: 'Alice Chen', username: 'alice.chen', email: 'alice.chen@blue-orange.ai', color: '#6366f1' },
    status: ChatUserStatus.ONLINE,
};

export const userBob: IChatUser = {
    user: { ...baseUser, id: 'u2', name: 'Bob Martinez', username: 'bob.martinez', email: 'bob.martinez@blue-orange.ai', color: '#f59e0b' },
    status: ChatUserStatus.ONLINE,
};

export const userCarla: IChatUser = {
    user: { ...baseUser, id: 'u3', name: 'Carla Johansson', username: 'carla.j', email: 'carla.johansson@blue-orange.ai', color: '#10b981' },
    status: ChatUserStatus.AWAY,
};

export const userDave: IChatUser = {
    user: { ...baseUser, id: 'u4', name: 'Dave Kim', username: 'dave.kim', email: 'dave.kim@blue-orange.ai', color: '#ef4444' },
    status: ChatUserStatus.DND,
};

export const userEva: IChatUser = {
    user: { ...baseUser, id: 'u5', name: 'Eva Rossi', username: 'eva.rossi', email: 'eva.rossi@blue-orange.ai', color: '#8b5cf6' },
    status: ChatUserStatus.OFFLINE,
};

export const userFrank: IChatUser = {
    user: { ...baseUser, id: 'u6', name: 'Frank Nguyen', username: 'frank.n', email: 'frank.nguyen@blue-orange.ai', color: '#0ea5e9' },
    status: ChatUserStatus.ONLINE,
    snoozeUntil: new Date(now.getTime() + 2 * 60 * 60_000),
};

export const userGrace: IChatUser = {
    user: { ...baseUser, id: 'u7', name: 'Grace Okafor', username: 'grace.o', email: 'grace.okafor@blue-orange.ai', color: '#ec4899' },
    status: ChatUserStatus.AWAY,
};

export const userHenry: IChatUser = {
    user: { ...baseUser, id: 'u8', name: 'Henry Liu', username: 'henry.liu', email: 'henry.liu@blue-orange.ai', color: '#14b8a6', lastActive: daysAgo(3), state: UserState.INACTIVE },
    status: ChatUserStatus.OFFLINE,
};

export const userIsabel: IChatUser = {
    user: { ...baseUser, id: 'u9', name: 'Isabel Torres', username: 'isabel.t', email: 'isabel.torres@blue-orange.ai', color: '#f97316' },
    status: ChatUserStatus.ONLINE,
};

export const userJack: IChatUser = {
    user: { ...baseUser, id: 'u10', name: 'Jack Patel', username: 'jack.p', email: 'jack.patel@blue-orange.ai', color: '#84cc16' },
    status: ChatUserStatus.DND,
};

export const userKate: IChatUser = {
    user: { ...baseUser, id: 'u11', name: 'Kate Wilson', username: 'kate.w', email: 'kate.wilson@blue-orange.ai', color: '#06b6d4' },
    status: ChatUserStatus.ONLINE,
};

export const userLiam: IChatUser = {
    user: { ...baseUser, id: 'u12', name: 'Liam O\'Brien', username: 'liam.ob', email: 'liam.obrien@blue-orange.ai', color: '#a855f7' },
    status: ChatUserStatus.AWAY,
};

export const allUsers: IChatUser[] = [
    currentUser, userBob, userCarla, userDave, userEva, userFrank,
    userGrace, userHenry, userIsabel, userJack, userKate, userLiam
];

// -- Mock Messages: #engineering --

export const engineeringMessages: IChatMessage[] = [
    { id: 'msg-1', content: 'Good morning everyone! Quick heads up: the CI pipeline is being upgraded this afternoon.', sender: userBob, timestamp: daysAgo(5), reactions: [{ emoji: '👍', userIds: ['u1', 'u3', 'u5'] }] },
    { id: 'msg-2', content: 'Thanks for the heads up. Will there be any downtime?', sender: userCarla, timestamp: daysAgo(5), reactions: [] },
    { id: 'msg-3', content: 'About 15 minutes max. I will post in <strong>#incidents</strong> if anything comes up.', sender: userBob, timestamp: daysAgo(5), reactions: [{ emoji: '🙏', userIds: ['u3'] }] },
    { id: 'msg-4', content: 'Has anyone looked at the new <code>@blue-orange-ai/foundations-core</code> release? The accordion component got a nice overhaul.', sender: userDave, timestamp: daysAgo(3), reactions: [{ emoji: '🔥', userIds: ['u1', 'u2'] }, { emoji: '👀', userIds: ['u5', 'u6'] }] },
    { id: 'msg-5', content: 'Yeah I tested it locally. The animation is much smoother now.', sender: currentUser, timestamp: daysAgo(3), reactions: [], edited: true },
    { id: 'msg-6', content: '<em>Nice work team.</em> Merging the graph package update as well.', sender: userEva, timestamp: daysAgo(2), reactions: [] },
    { id: 'msg-7', content: 'Quick question: are we still using <code>elkjs</code> for all the layout work or switching to dagre?', sender: userFrank, timestamp: daysAgo(2), reactions: [] },
    { id: 'msg-8', content: 'Sticking with ELK. The layered algorithm handles our edge cases better.', sender: userDave, timestamp: daysAgo(2), reactions: [{ emoji: '✅', userIds: ['u6'] }] },
    { id: 'msg-9', content: 'Reminder: sprint retro is at 3pm today. Please fill in the board beforehand.', sender: userGrace, timestamp: daysAgo(1), reactions: [] },
    { id: 'msg-10', content: 'Done! Added my items already.', sender: currentUser, timestamp: daysAgo(1), reactions: [] },
    { id: 'msg-11', content: 'I pushed a fix for the search filter rendering issue. PR is up for review: <strong>#1042</strong>', sender: userBob, timestamp: hoursAgo(4), reactions: [{ emoji: '🎉', userIds: ['u1', 'u3', 'u4', 'u7'] }] },
    { id: 'msg-12', content: 'Looking at it now. The approach looks clean.', sender: userCarla, timestamp: hoursAgo(3), reactions: [] },
    { id: 'msg-13', content: 'Approved and merged. Great turnaround!', sender: userCarla, timestamp: hoursAgo(2), reactions: [{ emoji: '🚀', userIds: ['u2'] }] },
    { id: 'msg-14', content: 'Is anyone free to pair on the chat layout component? I have the sidebar done but want a second pair of eyes on the split-panel logic.', sender: currentUser, timestamp: minutesAgo(45), reactions: [] },
    { id: 'msg-15', content: 'I can jump in after my 1:1. Give me about 20 minutes.', sender: userFrank, timestamp: minutesAgo(30), reactions: [{ emoji: '👍', userIds: ['u1'] }] },
    { id: 'msg-16', content: 'Perfect, ping me when you are ready.', sender: currentUser, timestamp: minutesAgo(28), reactions: [] },
    {
        id: 'msg-17',
        content: 'Here is the latest build report from the CI pipeline:',
        sender: userBob,
        timestamp: minutesAgo(10),
        reactions: [{ emoji: '👀', userIds: ['u1'] }],
        blocks: [
            {
                html: `<div class="build-report">
    <div class="build-header">
        <span class="build-status">&#9679; Build #1042 — Passed</span>
        <span class="build-time">2m 34s</span>
    </div>
    <div class="build-stats">
        <div class="stat"><span class="stat-value">142</span><span class="stat-label">Tests passed</span></div>
        <div class="stat"><span class="stat-value">0</span><span class="stat-label">Failed</span></div>
        <div class="stat"><span class="stat-value">98.2%</span><span class="stat-label">Coverage</span></div>
    </div>
    <div class="build-stages">
        <div class="stage"><span class="stage-dot done"></span> Install deps <span class="stage-time">18s</span></div>
        <div class="stage"><span class="stage-dot done"></span> Lint &amp; typecheck <span class="stage-time">32s</span></div>
        <div class="stage"><span class="stage-dot done"></span> Unit tests <span class="stage-time">1m 12s</span></div>
        <div class="stage"><span class="stage-dot done"></span> Build <span class="stage-time">32s</span></div>
    </div>
</div>`,
                css: `.build-report { padding: 12px 16px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 13px; color: #1d1c1d; }
.build-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.build-status { font-weight: 700; color: #22c55e; }
.build-time { font-size: 12px; color: #616061; }
.build-stats { display: flex; gap: 24px; margin-bottom: 12px; padding: 8px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; }
.stat { display: flex; flex-direction: column; align-items: center; }
.stat-value { font-size: 18px; font-weight: 700; color: #1d1c1d; }
.stat-label { font-size: 11px; color: #616061; margin-top: 2px; }
.build-stages { display: flex; flex-direction: column; gap: 6px; }
.stage { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #1d1c1d; }
.stage-dot { width: 8px; height: 8px; border-radius: 50%; }
.stage-dot.done { background-color: #22c55e; }
.stage-time { margin-left: auto; color: #616061; font-size: 11px; }`,
            }
        ]
    },
];

engineeringMessages[7].replyTo = engineeringMessages[6];
engineeringMessages[12].replyTo = engineeringMessages[10];

// Thread indicators on engineering messages
engineeringMessages[0].thread = {
    replyCount: 3,
    participants: [userCarla, userBob, userEva],
    lastReplyTimestamp: daysAgo(5),
};

engineeringMessages[3].thread = {
    replyCount: 5,
    participants: [currentUser, userDave, userFrank, userEva, userGrace],
    lastReplyTimestamp: daysAgo(3),
};

engineeringMessages[10].thread = {
    replyCount: 4,
    participants: [userDave, userBob, currentUser, userCarla],
    lastReplyTimestamp: hoursAgo(1),
};

engineeringMessages[13].thread = {
    replyCount: 2,
    participants: [userFrank, currentUser],
    lastReplyTimestamp: minutesAgo(28),
};

// -- Mock Messages: DM with Bob --

export const dmBobMessages: IChatMessage[] = [
    { id: 'dm-b-1', content: 'Hey Alice, did you see the latest design mockups?', sender: userBob, timestamp: daysAgo(1), reactions: [] },
    { id: 'dm-b-2', content: 'Yes! The new color palette looks great. I especially like the sidebar treatment.', sender: currentUser, timestamp: daysAgo(1), reactions: [{ emoji: '💜', userIds: ['u2'] }] },
    { id: 'dm-b-3', content: 'Agreed. I will set up a review session with the team tomorrow.', sender: userBob, timestamp: hoursAgo(6), reactions: [] },
    { id: 'dm-b-4', content: 'Sounds good. Let me know if you need anything from my side.', sender: currentUser, timestamp: hoursAgo(5), reactions: [] },
];

// -- Mock Messages: DM with Carla --

export const dmCarlaMessages: IChatMessage[] = [
    { id: 'dm-c-1', content: 'Hey, quick question about the deployment pipeline. Is the staging env up?', sender: userCarla, timestamp: hoursAgo(2), reactions: [] },
    { id: 'dm-c-2', content: 'Let me check... yes it is up and running the latest build.', sender: currentUser, timestamp: hoursAgo(1), reactions: [] },
];

// -- Mock Messages: #design-team --

export const designMessages: IChatMessage[] = [
    { id: 'des-1', content: 'Uploaded the new icon set to Figma. 48 icons covering all the navigation states.', sender: userGrace, timestamp: daysAgo(2), reactions: [{ emoji: '🎨', userIds: ['u1', 'u2', 'u4'] }] },
    { id: 'des-2', content: 'These look fantastic, Grace. The line weights are much more consistent now.', sender: userEva, timestamp: daysAgo(2), reactions: [] },
    { id: 'des-3', content: 'Can we get a dark-mode variant as well?', sender: userDave, timestamp: daysAgo(1), reactions: [] },
    { id: 'des-4', content: 'Already on it. Should have them by end of week.', sender: userGrace, timestamp: daysAgo(1), reactions: [{ emoji: '👏', userIds: ['u4', 'u5'] }] },
];

// -- Mock Messages: #general --

export const generalMessages: IChatMessage[] = [
    { id: 'gen-1', content: 'Welcome to the team, @Isabel! Feel free to introduce yourself here.', sender: userGrace, timestamp: daysAgo(4), reactions: [{ emoji: '👋', userIds: ['u1', 'u2', 'u3', 'u4', 'u6'] }] },
    { id: 'gen-2', content: 'Hi everyone! I\'m Isabel, joining the platform engineering team. Excited to be here!', sender: userIsabel, timestamp: daysAgo(4), reactions: [{ emoji: '🎉', userIds: ['u1', 'u2', 'u7'] }, { emoji: '👋', userIds: ['u3', 'u5', 'u8'] }] },
    { id: 'gen-3', content: 'Welcome Isabel! Feel free to reach out if you need anything.', sender: currentUser, timestamp: daysAgo(4), reactions: [] },
    { id: 'gen-4', content: 'Reminder: company all-hands is tomorrow at 2pm. Calendar invites should already be out.', sender: userKate, timestamp: daysAgo(1), reactions: [{ emoji: '👍', userIds: ['u1', 'u6'] }] },
    { id: 'gen-5', content: 'Will it be recorded? I have a conflict.', sender: userLiam, timestamp: daysAgo(1), reactions: [] },
    { id: 'gen-6', content: 'Yes, recording will be shared in #announcements afterwards.', sender: userKate, timestamp: daysAgo(1), reactions: [{ emoji: '🙏', userIds: ['u12'] }] },
];

// -- Mock Messages: #incidents --

export const incidentsMessages: IChatMessage[] = [
    { id: 'inc-1', content: '🔴 <strong>INCIDENT:</strong> Build pipeline timeout on main. Investigating now.', sender: userBob, timestamp: hoursAgo(6), reactions: [] },
    { id: 'inc-2', content: 'Root cause identified: a dependency mirror was down. Switching to fallback.', sender: userBob, timestamp: hoursAgo(5), reactions: [] },
    { id: 'inc-3', content: '🟢 <strong>RESOLVED:</strong> Pipeline is back to normal. All builds passing.', sender: userBob, timestamp: hoursAgo(4), reactions: [{ emoji: '✅', userIds: ['u1', 'u3', 'u9'] }] },
];

// -- Mock Messages: #random --

export const randomMessages: IChatMessage[] = [
    { id: 'rnd-1', content: 'Anyone up for lunch at the new ramen place today?', sender: userFrank, timestamp: hoursAgo(3), reactions: [{ emoji: '🍜', userIds: ['u1', 'u7'] }] },
    { id: 'rnd-2', content: 'Count me in!', sender: userGrace, timestamp: hoursAgo(3), reactions: [] },
    { id: 'rnd-3', content: 'Same here. Let\'s meet in the lobby at noon?', sender: currentUser, timestamp: hoursAgo(2), reactions: [{ emoji: '👍', userIds: ['u6', 'u7'] }] },
    { id: 'rnd-4', content: 'Just discovered you can use Cmd+K to jump between channels. Game changer.', sender: userIsabel, timestamp: hoursAgo(1), reactions: [{ emoji: '🤯', userIds: ['u2', 'u3'] }, { emoji: '💡', userIds: ['u4'] }] },
];

// -- Mock Messages: #announcements --

export const announcementsMessages: IChatMessage[] = [
    { id: 'ann-1', content: '📢 Q1 roadmap has been finalized. Check the wiki for details.', sender: userKate, timestamp: daysAgo(7), reactions: [{ emoji: '🎯', userIds: ['u1', 'u2', 'u3', 'u4'] }] },
    { id: 'ann-2', content: '📢 New PTO policy effective March 1st. HR will send individual emails with details.', sender: userKate, timestamp: daysAgo(3), reactions: [] },
];

// -- Mock Messages: DM with Dave --

export const dmDaveMessages: IChatMessage[] = [
    { id: 'dm-d-1', content: 'Hey Dave, are you free for a quick code review?', sender: currentUser, timestamp: hoursAgo(8), reactions: [] },
    { id: 'dm-d-2', content: 'Sorry, in DND for deep work today. Can do it tomorrow morning?', sender: userDave, timestamp: hoursAgo(7), reactions: [] },
    { id: 'dm-d-3', content: 'No worries, tomorrow works!', sender: currentUser, timestamp: hoursAgo(7), reactions: [{ emoji: '👍', userIds: ['u4'] }] },
];

// -- Mock Messages: DM with Grace --

export const dmGraceMessages: IChatMessage[] = [
    { id: 'dm-g-1', content: 'Grace, the icon set looks amazing. Any chance we can get a loading spinner variant?', sender: currentUser, timestamp: hoursAgo(4), reactions: [] },
    { id: 'dm-g-2', content: 'Absolutely, I was actually thinking about that. Give me a day or two.', sender: userGrace, timestamp: hoursAgo(3), reactions: [{ emoji: '✨', userIds: ['u1'] }] },
];

// -- Mock Messages: DM with Isabel --

export const dmIsabelMessages: IChatMessage[] = [
    { id: 'dm-i-1', content: 'Hi Alice! Bob suggested I reach out to you about the sidebar component architecture.', sender: userIsabel, timestamp: hoursAgo(2), reactions: [] },
    { id: 'dm-i-2', content: 'Of course! Happy to walk you through it. Want to do a screen share at 3?', sender: currentUser, timestamp: hoursAgo(1), reactions: [] },
    { id: 'dm-i-3', content: 'That works perfectly. Thanks!', sender: userIsabel, timestamp: minutesAgo(50), reactions: [{ emoji: '🙌', userIds: ['u1'] }] },
];

// -- Mock Messages: Group DM (Platform Team) --

export const groupDmPlatformMessages: IChatMessage[] = [
    { id: 'gdm-p-1', content: 'Team, the new microservice template is ready for review.', sender: userBob, timestamp: hoursAgo(5), reactions: [] },
    { id: 'gdm-p-2', content: 'I\'ll take a look after lunch.', sender: userIsabel, timestamp: hoursAgo(4), reactions: [] },
    { id: 'gdm-p-3', content: 'Same, also want to run the benchmarks against it.', sender: currentUser, timestamp: hoursAgo(3), reactions: [{ emoji: '👍', userIds: ['u2'] }] },
];

// -- Mock Messages: Group DM (Design Sync) --

export const groupDmDesignSyncMessages: IChatMessage[] = [
    { id: 'gdm-ds-1', content: 'Quick sync: are we aligned on the new button styles?', sender: userGrace, timestamp: hoursAgo(2), reactions: [] },
    { id: 'gdm-ds-2', content: 'Yes, I\'ve updated the Figma file with the latest feedback.', sender: userEva, timestamp: hoursAgo(1), reactions: [] },
];

// -- Mock Thread Replies (for msg-11 in engineering) --

export const threadRepliesForMsg11: IChatMessage[] = [
    { id: 'thread-1', content: 'Nice catch on the OR group edge case. That was tricky.', sender: userDave, timestamp: hoursAgo(3), reactions: [] },
    { id: 'thread-2', content: 'Yeah, the filter values were not updating when the last value in an OR group changed. Took a while to trace.', sender: userBob, timestamp: hoursAgo(3), reactions: [] },
    { id: 'thread-3', content: 'I added a regression test for it too. Should be covered now.', sender: userBob, timestamp: hoursAgo(2), reactions: [{ emoji: '✅', userIds: ['u4', 'u1'] }] },
    { id: 'thread-4', content: 'Great work. This was blocking a few users.', sender: currentUser, timestamp: hoursAgo(1), reactions: [] },
];

// -- Mock Conversations --

export const convEngineering: IChatConversation = {
    id: 'conv-1',
    name: 'engineering',
    type: ChatConversationType.CHANNEL,
    members: [currentUser, userBob, userCarla, userDave, userEva, userFrank, userGrace],
    lastMessage: engineeringMessages[engineeringMessages.length - 1],
    unreadCount: 3,
    starred: true,
    typingUsers: [userFrank],
};

export const convDesign: IChatConversation = {
    id: 'conv-2',
    name: 'design-team',
    type: ChatConversationType.CHANNEL,
    members: [currentUser, userGrace, userEva, userDave],
    lastMessage: designMessages[designMessages.length - 1],
    unreadCount: 0,
    starred: false,
};

export const convGeneral: IChatConversation = {
    id: 'conv-3',
    name: 'general',
    type: ChatConversationType.CHANNEL,
    members: allUsers,
    lastMessage: generalMessages[generalMessages.length - 1],
    unreadCount: 12,
    starred: false,
};

export const convIncidents: IChatConversation = {
    id: 'conv-7',
    name: 'incidents',
    type: ChatConversationType.CHANNEL,
    members: [currentUser, userBob, userCarla, userDave, userIsabel],
    lastMessage: incidentsMessages[incidentsMessages.length - 1],
    unreadCount: 0,
    starred: false,
};

export const convRandom: IChatConversation = {
    id: 'conv-8',
    name: 'random',
    type: ChatConversationType.CHANNEL,
    members: allUsers,
    lastMessage: randomMessages[randomMessages.length - 1],
    unreadCount: 2,
    starred: false,
};

export const convAnnouncements: IChatConversation = {
    id: 'conv-9',
    name: 'announcements',
    type: ChatConversationType.CHANNEL,
    members: allUsers,
    lastMessage: announcementsMessages[announcementsMessages.length - 1],
    unreadCount: 1,
    starred: true,
};

export const convDmBob: IChatConversation = {
    id: 'conv-4',
    name: 'Bob Martinez',
    type: ChatConversationType.DM,
    members: [currentUser, userBob],
    lastMessage: dmBobMessages[dmBobMessages.length - 1],
    unreadCount: 1,
    starred: false,
};

export const convDmCarla: IChatConversation = {
    id: 'conv-5',
    name: 'Carla Johansson',
    type: ChatConversationType.DM,
    members: [currentUser, userCarla],
    lastMessage: dmCarlaMessages[dmCarlaMessages.length - 1],
    unreadCount: 0,
    starred: false,
    typingUsers: [userCarla],
};

export const convDmDave: IChatConversation = {
    id: 'conv-6',
    name: 'Dave Kim',
    type: ChatConversationType.DM,
    members: [currentUser, userDave],
    lastMessage: dmDaveMessages[dmDaveMessages.length - 1],
    unreadCount: 0,
    starred: true,
};

export const convDmGrace: IChatConversation = {
    id: 'conv-10',
    name: 'Grace Okafor',
    type: ChatConversationType.DM,
    members: [currentUser, userGrace],
    lastMessage: dmGraceMessages[dmGraceMessages.length - 1],
    unreadCount: 1,
    starred: false,
};

export const convDmIsabel: IChatConversation = {
    id: 'conv-11',
    name: 'Isabel Torres',
    type: ChatConversationType.DM,
    members: [currentUser, userIsabel],
    lastMessage: dmIsabelMessages[dmIsabelMessages.length - 1],
    unreadCount: 2,
    starred: false,
    typingUsers: [userIsabel],
};

export const convDmFrank: IChatConversation = {
    id: 'conv-12',
    name: 'Frank Nguyen',
    type: ChatConversationType.DM,
    members: [currentUser, userFrank],
    lastMessage: undefined,
    unreadCount: 0,
    starred: false,
};

export const convDmEva: IChatConversation = {
    id: 'conv-13',
    name: 'Eva Rossi',
    type: ChatConversationType.DM,
    members: [currentUser, userEva],
    lastMessage: undefined,
    unreadCount: 0,
    starred: false,
};

export const convDmHenry: IChatConversation = {
    id: 'conv-14',
    name: 'Henry Liu',
    type: ChatConversationType.DM,
    members: [currentUser, userHenry],
    lastMessage: undefined,
    unreadCount: 0,
    starred: false,
};

export const convGroupPlatform: IChatConversation = {
    id: 'conv-15',
    name: 'Bob, Isabel, Alice',
    type: ChatConversationType.GROUP,
    members: [currentUser, userBob, userIsabel],
    lastMessage: groupDmPlatformMessages[groupDmPlatformMessages.length - 1],
    unreadCount: 1,
    starred: false,
};

export const convGroupDesignSync: IChatConversation = {
    id: 'conv-16',
    name: 'Grace, Eva, Alice',
    type: ChatConversationType.GROUP,
    members: [currentUser, userGrace, userEva],
    lastMessage: groupDmDesignSyncMessages[groupDmDesignSyncMessages.length - 1],
    unreadCount: 0,
    starred: false,
    typingUsers: [userGrace, userEva],
};

export const allConversations: IChatConversation[] = [
    convEngineering, convDesign, convGeneral, convIncidents, convRandom, convAnnouncements,
    convDmBob, convDmCarla, convDmDave, convDmGrace, convDmIsabel, convDmFrank, convDmEva, convDmHenry,
    convGroupPlatform, convGroupDesignSync,
];

// -- Message lookup by conversation --

export const messagesByConversation: Record<string, IChatMessage[]> = {
    'conv-1': engineeringMessages,
    'conv-2': designMessages,
    'conv-3': generalMessages,
    'conv-4': dmBobMessages,
    'conv-5': dmCarlaMessages,
    'conv-6': dmDaveMessages,
    'conv-7': incidentsMessages,
    'conv-8': randomMessages,
    'conv-9': announcementsMessages,
    'conv-10': dmGraceMessages,
    'conv-11': dmIsabelMessages,
    'conv-12': [],
    'conv-13': [],
    'conv-14': [],
    'conv-15': groupDmPlatformMessages,
    'conv-16': groupDmDesignSyncMessages,
};

// -- Mock Groups --

export const mockGroups: IChatGroup[] = [
    {
        label: 'Starred',
        conversations: allConversations.filter(c => c.starred),
        collapsed: false,
        icon: 'ri-star-fill',
    },
    {
        label: 'Channels',
        conversations: [convEngineering, convDesign, convGeneral, convIncidents, convRandom, convAnnouncements],
        collapsed: false,
        icon: 'ri-hashtag',
    },
    {
        label: 'Direct Messages',
        conversations: [convDmBob, convDmCarla, convDmDave, convDmGrace, convDmIsabel, convDmFrank, convDmEva, convDmHenry, convGroupPlatform, convGroupDesignSync],
        collapsed: false,
        icon: 'ri-chat-1-line',
    },
    {
        label: 'Teams',
        conversations: [],
        collapsed: true,
        icon: 'ri-team-line',
    },
];
