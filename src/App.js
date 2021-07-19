import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';

// class App extends Component {
//     state = {
//         posts: []
//     };

//     componentDidMount() {
//         this.getPosts();
//     }

//     getPosts() {
//         axios
//         // 今回の動作確認ではlocalhost:8000/usersにアクセスしないといけないのでこう書く
//             .get('http://localhost:8000/users/')
//             .then(res => {
//               //ここでデータをusersステートに格納している
//               this.setState({ users: res.data });
//               // 例えばgetPost関数内のthen()内で
//               // console.log(res.data)
//               // とするとコンソールログにres.dataに何のデータがどのような形で入っているか確認することができます。
//               console.log(res.data)
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     render() {
//         return (
//             <div>
//                 <p>Hello</p>
//             </div>
//         );
//     }
// }

const App = (props) => {
  // usersというstateと、それを更新するための関数としてsetUsersをペアで定義する
  // useState()でusersのstateを初期化
  // setUsers()は、データを取り出すのではなく、データをusersにセットする役割を持ちます
  // ですので、setUsers(res.data)でres.dataをusersに格納しています。
    const [users, setUsers]= useState([]);
    // useEffectはコンポーネントがこの処理を行うよ！という意味
    useEffect(() => {
        axios
        // 今回の動作確認ではlocalhost:8000/usersにアクセスしないといけないのでこう書く
            .get('http://localhost:8000/users/')
            .then(res => {
              //ここでデータをusersステートに格納している
              // resがaxiosを用いてバックエンドから受け取ったjsonです
              setUsers(res.data);
              // 例えばgetPost関数内のthen()内で
              // console.log(res.data)
              // とするとコンソールログにres.dataに何のデータがどのような形で入っているか確認することができます。
              console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    // useEffectで最後に[]を記述することで1回だけ、など指定できます。
    },[])
// ここでサイトに表示する内容を記載する
    return (
      <div>
        {/* 今回のコードでたまたまusersとitemという名前にしたのですが、試しに違う変数名に変更してもらってもうまく動く */}
        {/* 流れとしては、useEffectで定義したusersという変数に、useEffect内のsetUsers()でDRFから得たデータを格納しています。そのusersはリスト型にしていますので、いくつかのデータがリスト形式で格納されています。map関数でそのusers内のデータを順に取り出して表示しています。 */}
          {users.map(item => (
               <div key={item.id}>
                   <h1>{item.username}</h1>
                   <p>{item.email}</p>
               </div>
           ))}
      </div>
    );
}

export default App;
