type Events = {
	add: string;
	remove: string;
	line: string;
};

type EventKeys = keyof Events;
type OnEvent = {
	[Key in EventKeys as `on${Capitalize<Key>}`]: () => any;
};

const userActions: OnEvent = {
	onAdd: () => 'Added',
	onRemove: () => 'Removed',
	onLine: () => 'Line',
};
