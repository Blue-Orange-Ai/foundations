import {emojiHtmlToText} from './EmojiText';
import UnicodeEmoji from './UnicodeEmoji';

describe('emojiHtmlToText', () => {

	it('decodes hex and decimal character references', () => {
		expect(emojiHtmlToText('&#x1F44D;')).toBe('\u{1F44D}');
		expect(emojiHtmlToText('&#x1F44D;&#x1F3FD;')).toBe('\u{1F44D}\u{1F3FD}');
		expect(emojiHtmlToText('&#128077;')).toBe('\u{1F44D}');
	});

	it('leaves anything that is not a reference as literal text', () => {
		expect(emojiHtmlToText('<img src=x onerror="alert(1)">')).toBe('<img src=x onerror="alert(1)">');
		expect(emojiHtmlToText('&lt;b&gt;')).toBe('&lt;b&gt;');
	});

	it('drops references that are not characters', () => {
		expect(emojiHtmlToText('&#x0;&#xD800;&#x110000;')).toBe('');
	});

	it('handles nothing', () => {
		expect(emojiHtmlToText(undefined)).toBe('');
		expect(emojiHtmlToText(null)).toBe('');
	});

	it('decodes every emoji the picker ships with', () => {
		const emojis = Object.values(UnicodeEmoji.getGrouped()).flat();
		expect(emojis.length).toBeGreaterThan(1000);
		emojis.forEach(emoji => {
			const text = emojiHtmlToText(emoji.html);
			expect(text).not.toContain('&#');
			expect(text.length).toBeGreaterThan(0);
		});
	});
});
