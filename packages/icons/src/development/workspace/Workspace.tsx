import React, { useMemo, useState } from 'react';
import { Icon } from '../../components/icon/Icon';
import { Intent } from '../../common/intent';
import { IconCategories, IconCategoryNames, type IconCategory } from '../../generated/iconCategories';
import { IconNames, type IconName } from '../../generated/iconNames';
import { IconSize } from '../../icons/iconTypes';
import './Workspace.css';

const ALL_CATEGORIES = 'All';
const INTENTS: Intent[] = [Intent.NONE, Intent.PRIMARY, Intent.SUCCESS, Intent.WARNING, Intent.DANGER];

const ALL_ICON_NAMES = Object.values(IconNames) as IconName[];

export const Workspace: React.FC = () => {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState<IconCategory | typeof ALL_CATEGORIES>(ALL_CATEGORIES);
    const [size, setSize] = useState<number>(IconSize.LARGE);
    const [intent, setIntent] = useState<Intent>(Intent.NONE);
    const [dark, setDark] = useState(false);
    const [copied, setCopied] = useState<IconName | undefined>(undefined);

    const icons = useMemo(() => {
        const pool = category === ALL_CATEGORIES ? ALL_ICON_NAMES : IconCategories[category];
        const search = query.trim().toLowerCase();
        return search === '' ? pool : pool.filter(name => name.includes(search));
    }, [category, query]);

    const copyName = (name: IconName) => {
        navigator.clipboard?.writeText(name).catch(() => undefined);
        setCopied(name);
    };

    return (
        <div className={`icons-workspace${dark ? ' dark' : ''}`}>
            <header className="icons-workspace-header">
                <h1>
                    Icons <span className="icons-workspace-count">{icons.length} of {ALL_ICON_NAMES.length}</span>
                </h1>

                <div className="icons-workspace-controls">
                    <input
                        className="icons-workspace-search"
                        onChange={event => setQuery(event.target.value)}
                        placeholder="Search icons…"
                        type="search"
                        value={query}
                    />

                    <select onChange={event => setCategory(event.target.value as IconCategory)} value={category}>
                        <option value={ALL_CATEGORIES}>{ALL_CATEGORIES}</option>
                        {IconCategoryNames.map(name => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>

                    <select onChange={event => setSize(Number(event.target.value))} value={size}>
                        <option value={IconSize.STANDARD}>{IconSize.STANDARD}px (standard)</option>
                        <option value={IconSize.LARGE}>{IconSize.LARGE}px (large)</option>
                        <option value={32}>32px</option>
                        <option value={48}>48px</option>
                    </select>

                    <select onChange={event => setIntent(event.target.value as Intent)} value={intent}>
                        {INTENTS.map(value => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>

                    <label className="icons-workspace-toggle">
                        <input checked={dark} onChange={event => setDark(event.target.checked)} type="checkbox" />
                        Dark
                    </label>
                </div>

                {copied !== undefined && <p className="icons-workspace-copied">Copied “{copied}” to the clipboard.</p>}
            </header>

            <div className="icons-workspace-grid">
                {icons.map(name => (
                    <button className="icons-workspace-tile" key={name} onClick={() => copyName(name)} type="button">
                        <Icon icon={name} intent={intent} size={size} title={name} />
                        <span className="icons-workspace-name">{name}</span>
                    </button>
                ))}
            </div>

            {icons.length === 0 && <p className="icons-workspace-empty">No icons match “{query}”.</p>}
        </div>
    );
};
