import React from 'react';

import Message from './Message'

import $ from "jquery"
import { useEffect } from 'react';

const Messages = ({ messages, name }) => {
    // const checkWasImage = (i) => {
        // const isImage = messages.text.slice(0, 10)
        useEffect(() => {
            for (let i = 0; i < messages.length; i++) {
                let isImage = messages[i].text.slice(0, 10)

                if (isImage === "data:image") {
                    var image = new Image();
                    image.src = messages[i].text

                    $(`#${i} > .messageContainer > .messageBox`).html(image)
                }
                
                console.log(isImage)
            }
        })

        // if (isImage === "data:image") {
        //     var image = new Image();
        //     image.src = messages.text

        //     $(`#${i}`).html(image)
        // }
    // }
    return (
        <div>
            {messages.map((message, i) => <div id={i} key={i}><Message message={message} name={name} /></div>)}
        
        </div>
    );

}

export default Messages;
