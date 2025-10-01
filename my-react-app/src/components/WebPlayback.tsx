import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

type Props = {
    token: string;
    ringtoneUri: string;
    isRinging: boolean;
};

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void;
        Spotify: any;
    }
}
interface WebPlaybackPlayer {
    connect: () => Promise<boolean>;
    disconnect: () => void;
    addListener: (event: string, callback: (data: any) => void) => void;
    removeListener: (event: string, callback?: (data: any) => void) => void;
    pause: () => Promise<void>;
}

function WebPlayback({ token, ringtoneUri, isRinging }: Props) {
    const [player, setPlayer] = useState<WebPlaybackPlayer | null>(null);
    const [deviceId, setDeviceId] = useState<string>('');
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string>('');
    const playUri = useCallback(async (uri: string, deviceId: string) => {
        if (!token || !deviceId || !uri) return;

        console.log(`Attempting to play URI: ${uri} on device: ${deviceId}`);

        try {
            await axios.put(
                `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, 
                {
                    uris: [uri],
                    position_ms: 0,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Playback command sent successfully.');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error initiating playback:', error.response.data);
                
                if (error.response.status === 403) {
                     setError('Playback Error: User may not be premium, or player transfer failed. Token scope is likely correct now.');
                } else {
                     setError(`Playback error: ${error.response.data.error.message}`);
                }
            } else {
                console.error('Error initiating playback:', error);
                setError('Failed to send playback command.');
            }
        }
    }, [token]);
    useEffect(() => {
        if (!token) return;
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
        window.onSpotifyWebPlaybackSDKReady = () => {
            const playerInstance = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            setPlayer(playerInstance);

            playerInstance.addListener('ready', ({ device_id }: { device_id: string }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id);
                setIsReady(true);
                setError('');
            });

            playerInstance.addListener('not_ready', ({ device_id }: { device_id: string }) => {
                console.log('Device ID has gone offline', device_id);
                setIsReady(false);
            });

            playerInstance.addListener('initialization_error', ({ message }: { message: string }) => {
                console.error('Initialization Error:', message);
                setError('Initialization failed: ' + message);
            });
            playerInstance.addListener('authentication_error', ({ message }: { message: string }) => {
                console.error('Authentication Error:', message);
                setError('Authentication failed: ' + message);
            });

            playerInstance.connect().then((success: boolean) => {
                if (!success) {
                    console.warn('Failed to connect to Spotify. Check Spotify is running/active.');
                }
            });
        };
        return () => {
            if (player) {
                player.disconnect();
            }
            if (document.body.contains(script)) {
                 document.body.removeChild(script);
            }
            window.onSpotifyWebPlaybackSDKReady = () => {}; 
        };
    }, [token]);
    useEffect(() => {
        if (isReady && isRinging && ringtoneUri && deviceId) {
            playUri(ringtoneUri, deviceId);
        } else if (!isRinging && player) {
            player.pause();
        }
    }, [isReady, isRinging, ringtoneUri, deviceId, playUri, player]);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="bg-zinc-900 w-[400px] h-[300px] rounded-xl shadow-lg p-6 flex items-center justify-center flex-col">
                    <p className="text-red-500 text-center mb-4">Error: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-2 border border-gray-700 bg-zinc-800 rounded-lg flex items-center justify-between text-sm">
            {isReady ? (
                <>
                    <span className="font-medium flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${isRinging ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                        {isRinging ? <span className="text-red-400">ALARM RINGING!</span> : <span className="text-green-400">Player Ready</span>}
                    </span>
                    <span className="text-gray-400 text-xs">Device: {deviceId.substring(0, 8)}...</span>
                </>
            ) : (
                <>
                    <span className="text-white">Connecting Spotify Player...</span>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                </>
            )}
        </div>
    );
}

export default WebPlayback;