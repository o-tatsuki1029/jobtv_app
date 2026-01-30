"use client";

interface Channel {
  id: string;
  name: string;
  logo: string;
  color: string;
}

interface ChannelListProps {
  channels: Channel[];
  onChannelSelect?: (channelId: string) => void;
}

export default function ChannelList({ channels, onChannelSelect }: ChannelListProps) {
  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="flex space-x-4 px-4">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => onChannelSelect?.(channel.id)}
            className="flex flex-col items-center space-y-2 min-w-[80px] hover:opacity-80 transition-opacity"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
              style={{ backgroundColor: channel.color }}
            >
              {channel.logo}
            </div>
            <span className="text-xs text-white text-center">{channel.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
