"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Popover } from "react-tiny-popover";
import EmojiPicker from "emoji-picker-react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
interface Message {
    sender: string;
    message: string;
    time: string;
    self: boolean;
}

interface ChatWindowProps {
    messages: Message[];
    avatarSrc: string;
    title: string;
    subtitle: string;
    width?: string;
    height?: string;
}

const ChatBox: React.FC<ChatWindowProps> = ({ messages: initialMessages, avatarSrc, title, subtitle, width = "100%", height = "100%" }) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState("");
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const emojiButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() === "") return;

        const newMsg: Message = {
            sender: "自己",
            message: newMessage.replace(/\n/g, '<br/>'),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            self: true,
        };

        setMessages([...messages, newMsg]);
        setNewMessage(""); // 清空输入框
    };

    const handleEmojiSelect = (emojiData: any) => {
        setNewMessage(newMessage + emojiData.emoji);
    };

    return (

        <ResizableBox
            width={500}
            height={900}
            minConstraints={[300, 200]}
            maxConstraints={[5000, 1000]}
            className="border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-sm flex flex-col"
            resizeHandles={['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w']} // 多方向调整
        >            <div className="sticky top-0 bg-white dark:bg-boxdark z-10 flex items-center justify-between border-b border-stroke px-6 py-4.5 dark:border-strokedark">
                <div className="flex items-center">
                    <div className="mr-4.5 h-13 w-full max-w-13 overflow-hidden rounded-full">
                        <Image
                            src={avatarSrc}
                            alt="avatar"
                            className="h-full w-full object-cover object-center"
                            width={52}
                            height={52}
                        />
                    </div>
                    <div>
                        <h5 className="font-medium text-black dark:text-white">
                            {title}
                        </h5>
                        <p className="text-sm">{subtitle}</p>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-auto space-y-3.5 px-6 py-7.5">
                {messages.map((msg, index) => (
                    <div key={index} className={`max-w-125 ${msg.self ? 'ml-auto' : ''}`}>
                        {!msg.self && (
                            <p className="mb-2.5 text-sm font-medium">{msg.sender}</p>
                        )}
                        <div
                            className={`mb-2.5 rounded-2xl px-5 py-3 ${msg.self
                                ? 'rounded-br-none bg-primary text-white'
                                : 'rounded-tl-none bg-gray dark:bg-boxdark-2'
                                }`}
                            dangerouslySetInnerHTML={{ __html: msg.message }}
                        >
                        </div>
                        <p className={`text-xs ${msg.self ? 'text-right' : ''}`}>
                            {msg.time}
                        </p>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="sticky bottom-0 left-0 w-full border-t border-stroke bg-white px-6 py-5 dark:border-strokedark dark:bg-boxdark">
                <form
                    className="flex justify-between space-x-4.5"
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                >
                    <div className="relative w-full">
                        <textarea
                            placeholder="在这里输入内容"
                            className="h-13 w-full rounded-md border border-stroke bg-gray pl-5 pr-19 text-black placeholder-body outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            rows={2}
                            style={{ resize: 'none' }}
                        />
                        <div className="absolute right-5 top-1/2 inline-flex -translate-y-1/2 items-center justify-end space-x-4">
                            <button className="hover:text-primary">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    className="fill-current"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M11.835 1.79102C11.2378 1.79102 10.6651 2.02824 10.2428 2.45051L3.3503 9.34302C2.64657 10.0467 2.25122 11.0012 2.25122 11.9964C2.25122 12.9917 2.64657 13.9461 3.3503 14.6499C4.05403 15.3536 5.0085 15.7489 6.00372 15.7489C6.99895 15.7489 7.95341 15.3536 8.65714 14.6499L15.5496 7.75736C15.8425 7.46446 16.3174 7.46446 16.6103 7.75736C16.9032 8.05025 16.9032 8.52512 16.6103 8.81802L9.7178 15.7105C8.73277 16.6956 7.39677 17.2489 6.00372 17.2489C4.61067 17.2489 3.27468 16.6956 2.28964 15.7105C1.30461 14.7255 0.751221 13.3895 0.751221 11.9964C0.751221 10.6034 1.30461 9.26739 2.28964 8.28236L9.18214 1.38985C9.88572 0.686279 10.84 0.291016 11.835 0.291016C12.83 0.291016 13.7842 0.686279 14.4878 1.38985C15.1914 2.09343 15.5866 3.04768 15.5866 4.04268C15.5866 5.03769 15.1914 5.99194 14.4878 6.69552L7.5878 13.588C7.16569 14.0101 6.59318 14.2473 5.99622 14.2473C5.39926 14.2473 4.82676 14.0101 4.40464 13.588C3.98253 13.1659 3.74539 12.5934 3.74539 11.9964C3.74539 11.3995 3.98253 10.827 4.40464 10.4049L10.7725 4.04454C11.0655 3.75182 11.5404 3.7521 11.8331 4.04517C12.1258 4.33823 12.1256 4.81311 11.8325 5.10583L5.4653 11.4655C5.32469 11.6063 5.24539 11.7974 5.24539 11.9964C5.24539 12.1956 5.32449 12.3865 5.4653 12.5274C5.60611 12.6682 5.79709 12.7473 5.99622 12.7473C6.19535 12.7473 6.38633 12.6682 6.52714 12.5274L13.4271 5.63486C13.8492 5.21261 14.0866 4.63973 14.0866 4.04268C14.0866 3.4455 13.8494 2.87278 13.4271 2.45051C13.0049 2.02824 12.4321 1.79102 11.835 1.79102Z"
                                    />
                                </svg>
                            </button>
                            <Popover
                                isOpen={isPopoverOpen}
                                positions={['top', 'left', 'right']}
                                padding={10}
                                onClickOutside={() => setIsPopoverOpen(false)}
                                content={<EmojiPicker onEmojiClick={handleEmojiSelect} />}
                            >
                                <button className="hover:text-primary" ref={emojiButtonRef}
                                    type="button"
                                    onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                                    <svg
                                        width="19"
                                        height="18"
                                        viewBox="0 0 19 18"
                                        className="fill-current"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M9.5 2.25C5.77208 2.25 2.75 5.27208 2.75 9C2.75 12.7279 5.77208 15.75 9.5 15.75C13.2279 15.75 16.25 12.7279 16.25 9C16.25 5.27208 13.2279 2.25 9.5 2.25ZM1.25 9C1.25 4.44365 4.94365 0.75 9.5 0.75C14.0564 0.75 17.75 4.44365 17.75 9C17.75 13.5564 14.0564 17.25 9.5 17.25C4.94365 17.25 1.25 13.5564 1.25 9Z"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M7.09769 10.0469C6.84856 9.71825 6.38037 9.6523 6.05004 9.90004C5.71867 10.1486 5.65152 10.6187 5.90004 10.95L6.50004 10.5C5.90004 10.95 5.90022 10.9503 5.90041 10.9505L5.9008 10.9511L5.90167 10.9522L5.90372 10.9549L5.90913 10.962L5.9251 10.9824C5.93803 10.9988 5.95555 11.0204 5.97757 11.0467C6.02155 11.0991 6.08379 11.17 6.16363 11.2533C6.32269 11.4193 6.55512 11.6379 6.85579 11.8566C7.45424 12.2918 8.3559 12.75 9.50004 12.75C10.6442 12.75 11.5458 12.2918 12.1443 11.8566C12.445 11.6379 12.6774 11.4193 12.8365 11.2533C12.9163 11.17 12.9785 11.0991 13.0225 11.0467C13.0445 11.0204 13.0621 10.9988 13.075 10.9824L13.091 10.962L13.0964 10.9549L13.0984 10.9522L13.0993 10.9511L13.0997 10.9505C13.0999 10.9503 13.1 10.95 12.5 10.5L13.1 10.95C13.3486 10.6187 13.2814 10.1486 12.95 9.90004C12.6197 9.6523 12.1515 9.71825 11.9024 10.0469L11.8989 10.0514C11.8945 10.057 11.886 10.0676 11.8736 10.0823C11.8487 10.112 11.8084 10.1582 11.7535 10.2155C11.643 10.3308 11.477 10.4872 11.262 10.6435C10.8292 10.9583 10.2309 11.25 9.50004 11.25C8.76919 11.25 8.17084 10.9583 7.73805 10.6435C7.52309 10.4872 7.35709 10.3308 7.24661 10.2155C7.19168 10.1582 7.15139 10.112 7.12653 10.0823C7.11412 10.0676 7.10563 10.057 7.10117 10.0514L7.09769 10.0469Z"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M6.5 6.75C6.5 6.33579 6.83579 6 7.25 6H7.2575C7.67171 6 8.0075 6.33579 8.0075 6.75C8.0075 7.16421 7.67171 7.5 7.2575 7.5H7.25C6.83579 7.5 6.5 7.16421 6.5 6.75Z"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M11 6.75C11 6.33579 11.3358 6 11.75 6H11.7575C12.1717 6 12.5075 6.33579 12.5075 6.75C12.5075 7.16421 12.1717 7.5 11.7575 7.5H11.75C11.3358 7.5 11 7.16421 11 6.75Z"
                                        />
                                    </svg>
                                </button>
                            </Popover>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="flex h-12 w-full max-w-8 items-center justify-center rounded-md text-white hover:bg-opacity-90"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" image-rendering="optimizeQuality" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" viewBox="0 0 1466 2074"><path fill="#ced3db" d="M1021 686l-1 32 -4 154 21 -17c55,-47 131,-62 193,-17 42,31 65,81 61,133 -2,27 -12,53 -28,75 -71,98 -199,308 -310,402l0 5c22,17 36,43 35,73l0 35c8,13 13,28 14,45l13 375c1,26 -8,48 -26,67 -18,19 -40,28 -66,28l-510 0c-26,0 -49,-10 -67,-29 -18,-19 -26,-42 -24,-69l26 -380c1,-16 6,-31 15,-44l0 -36c0,-22 7,-41 20,-57l0 -6c-38,-46 -60,-108 -62,-168l-14 -369c0,-6 0,-11 1,-16l1 -7 3 -64c7,-166 253,-143 -128,-143 -59,0 -111,-37 -131,-92 -5,-15 -8,-31 -8,-47l0 -362c0,-77 62,-139 139,-139l1142 0c77,0 139,62 139,139l0 362c0,16 -3,32 -8,47 -20,55 -72,92 -131,92l-306 0z" /><path fill="#fff" d="M975 640l-1 32 -4 154 21 -17c55,-47 131,-62 193,-17 42,31 65,81 61,133 -2,27 -12,53 -28,75 -71,98 -199,308 -310,402l0 5c22,17 36,43 35,73l0 35c8,13 13,28 14,45l13 375c1,26 -8,48 -26,67 -18,19 -40,28 -66,28l-510 0c-26,0 -49,-10 -67,-29 -18,-19 -26,-42 -24,-69l26 -380c1,-16 6,-31 15,-44l0 -36c0,-22 7,-41 20,-57l0 -6c-38,-46 -60,-108 -62,-168l-14 -369c0,-6 0,-11 1,-16l1 -7 3 -64c7,-166 253,-143 -128,-143 -59,0 -111,-37 -131,-92 -5,-15 -8,-31 -8,-47l0 -362c0,-77 62,-139 139,-139l1142 0c77,0 139,62 139,139l0 362c0,16 -3,32 -8,47 -20,55 -72,92 -131,92l-306 0z" /><path fill="#ff7069" d="M139 91l1142 0c26,0 48,21 48,48l0 362c0,26 -21,48 -48,48l-1142 0c-26,0 -48,-21 -48,-48l0 -362c0,-26 21,-48 48,-48z" /><path fill="#f7635b" d="M94 517l1232 0c-7,18 -24,32 -45,32l-1142 0c-21,0 -38,-13 -45,-32z" /><path fill="#fff" fill-rule="nonzero" d="M483 192l-66 0 0 286 45 0 0 -108 21 0c45,0 67,-25 67,-71l0 -37c0,-46 -22,-71 -67,-71zm0 41c14,0 22,7 22,27l0 43c0,20 -8,27 -22,27l-21 0 0 -97 21 0zm131 25c0,-20 9,-28 23,-28 14,0 23,8 23,28l0 155c0,20 -9,28 -23,28 -14,0 -23,-8 -23,-28l0 -155zm-45 152c0,46 24,72 68,72 44,0 68,-26 68,-72l0 -149c0,-46 -24,-72 -68,-72 -44,0 -68,26 -68,72l0 149zm160 -149c0,82 88,93 88,152 0,20 -9,28 -23,28 -14,0 -23,-7 -23,-28l0 -20 -43 0 0 18c0,46 23,72 67,72 44,0 67,-26 67,-72 0,-82 -88,-93 -88,-152 0,-20 8,-28 22,-28 14,0 22,8 22,28l0 12 43 0 0 -9c0,-46 -22,-72 -66,-72 -44,0 -66,26 -66,72l0 0zm146 -28l47 0 0 245 45 0 0 -245 47 0 0 -41 -139 0 0 41z" /><path fill="#fed198" d="M1130 866l0 0c-26,-19 -56,-8 -80,13l-150 126 -11 -38 -11 -94 5 -204 5 -205c1,-32 -25,-60 -57,-60l0 0c-32,0 -59,25 -60,57l-9 352 -16 1 6 -82c2,-32 -25,-59 -57,-60 -32,-1 -58,25 -60,57l-6 89 -18 1 5 -57c3,-32 -25,-60 -57,-60l0 0c-32,0 -57,25 -60,57l-6 65 -21 1 1 -33c1,-32 -25,-60 -57,-60l0 0c-32,0 -59,25 -60,57l-3 68 -2 12 14 369c2,50 22,93 44,117 6,7 13,13 19,16l-21 567 427 0 -24 -582c92,-43 263,-318 330,-409 19,-26 13,-62 -13,-80z" /><path fill="#f0b97d" d="M837 1937l-24 -582c92,-43 263,-318 330,-409 6,-9 10,-19 11,-29 -59,76 -281,392 -373,426l22 594 34 0z" /><polygon fill="#83cf8f" points="865 1562 394 1557 368 1937 878 1937" /><polygon fill="#f2f2f2" points="851 1479 409 1471 409 1557 851 1564" /><path fill="#e4e7ed" d="M461 1628c-21,0 -37,16 -38,36 0,20 16,36 37,37 21,0 37,-16 38,-36 0,-20 -16,-36 -37,-37z" /><path fill="#fff" d="M1074 877l-37 36 55 56 37-36c28-28-27-83-55-56zM792 450l-2 44 79 2 2-44c1-35-81-36-79-2z" /></svg>
                    </button>
                </form>
            </div>
        </ResizableBox>
    );
};

export default ChatBox;
