import {Comment, Sockets, User} from "@blue-orange-ai/foundations-clients";
import commentsInstance from "../../config/BlueOrangeCommentsConfig";
import passport from "../../config/BlueOrangePassportConfig";
import blueOrangeSocketUri from "../../config/BlueOrangeSocketsConfig";

/**
 * Whoever wrote a comment. Only `name` and `avatar` are ever read by the
 * comment components, so hosts backed by something other than passport (a
 * local file, an offline desktop app) can describe an author without having
 * to fabricate a whole passport user.
 */
export type CommentAuthor = Partial<User>;

/**
 * Everything the comment components need from their backing store.
 *
 * The default implementation talks to the comments service over HTTP and
 * listens for live updates over STOMP, which is what every hosted Blue Orange
 * app wants. Hosts without that server — the serif desktop app keeps its
 * comments inside the document file — supply their own implementation through
 * `BlueOrangeCommentsProvider` instead, and the same components work unchanged.
 */
export interface CommentsStore {
	get: (topic: string) => Promise<Array<Comment>>,
	create: (comment: Comment) => Promise<Comment>,
	update: (comment: Comment) => Promise<Comment>,
	delete: (comment: Comment) => Promise<void>,
	// Whether the signed-in user may edit/delete this comment.
	isEditable: (comment: Comment) => Promise<boolean>,
	/**
	 * Optional live feed of changes to a topic. Implementations that push
	 * every change back through create/update/delete (a local store) can leave
	 * this out — the components refresh themselves after their own writes.
	 * Returns an unsubscribe function.
	 */
	subscribe?: (topic: string, listener: (comment: Comment) => void) => () => void,
	// Who is writing. Used for the avatar next to the comment box.
	currentUser?: () => Promise<CommentAuthor | undefined>,
	// Resolves the author of an existing comment.
	getUser?: (userId: string) => Promise<CommentAuthor | undefined>,
}

/**
 * The hosted store: the comments service for reads and writes, sockets for
 * live updates, passport for authors. Used whenever no provider overrides it.
 */
export const defaultCommentsStore: CommentsStore = {
	get: (topic: string) => commentsInstance.get(topic),
	create: (comment: Comment) => commentsInstance.create(comment),
	update: (comment: Comment) => commentsInstance.update(comment),
	delete: (comment: Comment) => commentsInstance.delete(comment),
	isEditable: (comment: Comment) => commentsInstance.isEditable(comment).then(state => state.valueOf()),
	subscribe: (topic: string, listener: (comment: Comment) => void) => {
		const sockets = new Sockets(
			blueOrangeSocketUri,
			() => {
				sockets.subscribe('/topic/' + topic, (message: any) => {
					listener(JSON.parse(message.body) as Comment);
				});
			}
		);
		sockets.connect();
		return () => sockets.disconnect();
	},
	currentUser: () => passport.currentUser(),
	getUser: (userId: string) => passport.get(userId),
};
