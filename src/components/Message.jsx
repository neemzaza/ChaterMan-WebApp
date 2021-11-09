import React from 'react';
import $ from "jquery"
import parse from "html-react-parser"

const Message = ({ message: { text, user }, name }) => {
    let isSentByCurrentUser = false;

    const trimmedName = name.trim().toLowerCase();

    // const isImage = text.slice(0, 10)

    // console.log(isImage)

    // if (isImage === "data:image") {
    //     var image = new Image();
    //     image.src = text

    //     let id = text.slice(11, text.length + 1)
    //     $(`#${text}`).html(image)
    // }

    const replaceURL = (text) => {
        if (!text) return
    
        let urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
        return text.replace(urlRegex, url => {
          let hyperlink = url;
          if (!hyperlink.match('^https?:\/\/')) {
            hyperlink = 'http://' + hyperlink;
          }
    
          return '<a href="' + hyperlink + '" target="_blank" rel="noopener noreferrer">' + url + '</a>'
        })
      }

    if (user === trimmedName) {
        isSentByCurrentUser = true;
    }

    return (
        isSentByCurrentUser
        ? (
            <div className="messageContainer justifyEnd">
                <div className="messageBox meBackground">
                    <p className="messageText">{parse(replaceURL(text))}</p>
                </div>
                <p className="sentText your">{trimmedName}</p>
            </div>
        ) 
        : (
            <div className="messageContainer justifyStart">
                <p className="sentText">{user}</p>
                <br/>
                <div className="messageBox anotherBackground">
                    <p className="messageText">{parse(replaceURL(text))}</p>
                </div>
            </div>
        )
    );
}

export default Message;
