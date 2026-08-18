import React, {useCallback, useState} from "react";

import './EventLog.css'

export interface EventLogEntry {
	id: number,
	time: string,
	text: string
}

/** Rolling log of wrapper callback firings, capped at the latest 100. */
export const useEventLog = (): [Array<EventLogEntry>, (text: string) => void, () => void] => {
	const [entries, setEntries] = useState<Array<EventLogEntry>>([]);
	const log = useCallback((text: string) => {
		setEntries((previous) => [
			{id: Date.now() + Math.random(), time: new Date().toLocaleTimeString(), text: text},
			...previous
		].slice(0, 100));
	}, []);
	const clear = useCallback(() => setEntries([]), []);
	return [entries, log, clear];
}

interface Props {
	entries: Array<EventLogEntry>,
	onClear?: () => void
}

export const EventLog: React.FC<Props> = ({entries, onClear}) => {

	return (
		<div className="event-log">
			<div className="event-log-header">
				<span>Events</span>
				{onClear && <button className="event-log-clear" onClick={onClear}>Clear</button>}
			</div>
			<div className="event-log-entries">
				{entries.length === 0 && <div className="event-log-empty">Interact with the canvas — wrapper callbacks land here.</div>}
				{entries.map((entry) => (
					<div key={entry.id} className="event-log-entry">
						<span className="event-log-time">{entry.time}</span>
						<span className="event-log-text">{entry.text}</span>
					</div>
				))}
			</div>
		</div>
	)
}
