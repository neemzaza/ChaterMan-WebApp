import axios from 'axios'

export default async function queryAllPost() {
    await axios.get('http://localhost:5000/get-post').then(data => {
        return data.data
    })
        // push error to contentInNofi
        .catch(err => {
            return "Failed to connect to post : " + err
        })
}