import React, { useState, useEffect, onClick} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { apiURL } from './Default';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom'

const cookies = new Cookies();

const Top = () => {
  // リストで定義するというのはつまり以下のような形です。
  // そしてpostの中にDRFから取得したデータを保存し、return内ではmap関数で処理すると、リストに格納したデータを1つずつ表示できると思います。
  const [post, setPost] = useState([]);

  useEffect(() => {
    async function fetchData(){
      const result = await axios.get(
        apiURL+'posts/get_data/',
        {
          headers: {
              'Content-Type': 'application/json',
            }
        })
        .then(result => {
          setPost(result.data);
          console.log(result.data[0].photo)
          console.log(result.data[0].title)
          console.log(result.data)
        })
        .catch(err => {
          console.log(err);
        });
    }
  fetchData();
  },[]);

  return (
      <div className="">
              {post.map(item => (
                <div>
                  <p>Title: {item.title}</p>
                  <p>Condition: {item.condition}</p>
                  <p>Maker: {item.maker}</p>
                  <p>Price: {item.price}</p>
                  <p>Description: {item.description}</p>
                  <p>User: {item.user}</p>
                  <p>Shipping price: {item.shipping_price}</p>
                  <img src={item.photo} />
                  <img src={item.photo2} />
                  <img src={item.photo3} />
                  <img src={item.photo4} />
                  <img src={item.photo5} />
                </div>

              ))}
      </div>
  );
}

export default Top;