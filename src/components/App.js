// import React, { Component, useState, useEffect } from 'react';
// import axios from 'axios';


// import Auth from './Auth'; /** 追加 **/
// import Header from './Header';
// import LoggedIn from './LoggedIn'; /** 追加 **/
// import LoggedOut from './LoggedOut'; /** 追加 **/
// import { BrowserRouter as Router, Route } from 'react-router-dom';
// import registerForm from './registerForm';
// import { CookiesProvider, withCookies } from 'react-cookie';

// // class App extends Component {
// //     state = {
// //         posts: []
// //     };

// //     componentDidMount() {
// //         this.getPosts();
// //     }

// //     getPosts() {
// //         axios
// //         // 今回の動作確認ではlocalhost:8000/usersにアクセスしないといけないのでこう書く
// //             .get('http://localhost:8000/users/')
// //             .then(res => {
// //               //ここでデータをusersステートに格納している
// //               this.setState({ users: res.data });
// //               // 例えばgetPost関数内のthen()内で
// //               // console.log(res.data)
// //               // とするとコンソールログにres.dataに何のデータがどのような形で入っているか確認することができます。
// //               console.log(res.data)
// //             })
// //             .catch(err => {
// //                 console.log(err);
// //             });
// //     }

// //     render() {
// //         return (
// //             <div>
// //                 <p>Hello</p>
// //             </div>
// //         );
// //     }
// // }

// const App = (props) => {
//   // usersというstateと、それを更新するための関数としてsetUsersをペアで定義する
//   // useState()でusersのstateを初期化
//   // setUsers()は、データを取り出すのではなく、データをusersにセットする役割を持ちます
//   // ですので、setUsers(res.data)でres.dataをusersに格納しています。
//     const [users, setUsers]= useState([]);
//     // useEffectはコンポーネントがこの処理を行うよ！という意味
//     useEffect(() => {
//         axios
//         // 今回の動作確認ではlocalhost:8000/usersにアクセスしないといけないのでこう書く
//             .get('http://localhost:8000/users/')
//             .then(res => {
//               //ここでデータをusersステートに格納している
//               // resがaxiosを用いてバックエンドから受け取ったjsonです
//               setUsers(res.data);
//               // 例えばgetPost関数内のthen()内で
//               // console.log(res.data)
//               // とするとコンソールログにres.dataに何のデータがどのような形で入っているか確認することができます。
//               console.log(res.data);
//             })
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': '5266f02fb8cb0cb63a8f26b2f0beab4cdf703d55',
//              }

//             .catch(err => {
//                 console.log(err);
//             });
//     // useEffectで最後に[]を記述することで1回だけ、など指定できます。
//     },[])
// // ここでサイトに表示する内容を記載する
//     return (
//       // <div>
//       //   {/* 今回のコードでたまたまusersとitemという名前にしたのですが、試しに違う変数名に変更してもらってもうまく動く */}
//       //   {/* 流れとしては、useEffectで定義したusersという変数に、useEffect内のsetUsers()でDRFから得たデータを格納しています。そのusersはリスト型にしていますので、いくつかのデータがリスト形式で格納されています。map関数でそのusers内のデータを順に取り出して表示しています。 */}
//       //     {users.map(item => (
//       //          <div key={item.id}>
//       //              <h1>{item.username}</h1>
//       //              <p>{item.email}</p>
//       //          </div>
//       //      ))}
//       // </div>
//       <Router>
//       <div className="App">
//         { /** 変更 **/ }
//         <CookiesProvider>
//           <Header />

//             <LoggedIn>
//               {/* <Route path="/" exact component={Home} />
//               <Route path="/post/:postId/" component={Post} /> */}
//               <Route path="/new" component={registerForm} />
//             </LoggedIn>

//             <LoggedOut>
//               <Route path="/auth" component={Auth} />
//             </LoggedOut>
//         </CookiesProvider>
//       </div>
//     </Router>
//     );
// }

// export default App;




import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Default from './Default';

class App extends Component {
    render() {
        return (
          // 今回のアプリケーションではルーティングにReactのルーティングライブラリであるreact-router-domを使用しています。このreact-router-domはReactの開発に基本的に欠かせないライブラリであり、App.jsで宣言しておく必要があります。ですので、App.jsの
          // import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
          // でそれらを宣言しています。
          // Routerはルーティングを行うためのコンポーネントで、Switchは<Route >コンポーネント（URLとコンポーネントを指定）を指定する際に括る上位コンポーネントです。App.jsやDefault.jsの構成を見ていただくとこれらが埋め込まれていることが分かると思います。Switchを用いることでURLによってコンポーネントを切り替えることが実現できるようになっています。
          // より詳しい内容は、こちらが公式ですので、こちらを見ていただくと良いかと思います。
          // https://reactrouter.com/web/guides/quick-start
          <Router>
            <Switch>
              {/* path=で見せたいページのURL名を指定、component=でそのURL名で表示させたいコンポーネント名を記載 */}
              <Route path="/" component={Default} />
            </Switch>
          </Router>
        );
    }
}
export default App;