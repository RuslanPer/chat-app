import React, { ChangeEvent, useEffect, useState, KeyboardEvent } from 'react'
import s from './Chat.module.css'
import sendIcon from '../../assets/send.svg'

type MessageType = {
	message: string
	photo: string
	userId: number
	userName: string
}

export const Chat = () => {
	const [newMessage, setNewMessage] = useState('')
	const [messages, setMessages] = useState<MessageType[]>([])
	const [ws, setWs] = useState<any>(null)

	if (ws) {
		ws.onmessage = (messageEvent: { data: string }) => {
			const messagesRes = JSON.parse(messageEvent.data)
			setMessages([...messages, ...messagesRes])
		}
	}

	useEffect(() => {
		const localWs = new WebSocket(
			'wss://social-network.samuraijs.com/handlers/ChatHandler.ashx'
		)
		setWs(localWs)
	}, [])

	const onMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
		setNewMessage(e.currentTarget.value)
	}

	const sendMessage = () => {
		if (newMessage.trim() !== '') {
			ws.send(newMessage)
			setNewMessage('')
		}
	}

	const onKeyDownSend = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			sendMessage()
		}
	}

	return (
		<div className={s.chat}>
			<div className={s.messages}>
				<div className={s.messagesContent}>
					{messages?.map((m, i) => (
						<div key={m.userId + i} className={s.messageBox}>
							<div className={s.avatar}>
								<img src={m.photo} alt='user_photo' />
							</div>
							<div className={s.message}>{m.message}</div>
							<span className={s.name}>{m.userName}</span>
						</div>
					))}
				</div>
			</div>

			<div className={s.addMessage}>
				<input
					onKeyDown={onKeyDownSend}
					value={newMessage}
					onChange={onMessageChange}
					placeholder='Type something...'
					className={s.input}
					type='text'
				/>
				<button
					disabled={!newMessage}
					onClick={sendMessage}
					className={s.buttonSend}
				>
					<img src={sendIcon} alt='send' />
				</button>
			</div>
		</div>
	)
}
