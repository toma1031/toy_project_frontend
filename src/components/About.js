import React, { useState, useEffect, onClick} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { apiURL } from './Default';
import { useSelector } from "react-redux";
import { useParams, Link } from 'react-router-dom'

import { useDispatch } from "react-redux";
import { setUserID } from "../stores/user";

import { useForm } from "react-hook-form";
import about_image from "../images/retrotoy_about.jpg";

const cookies = new Cookies();

const About = () => {


  return (
      <div className="">
        <h1>About</h1>
        <img src={about_image} alt="About" />;
        <p>
          Retro Toy is the web board for people who want to show their Retro Toys.
        </p>
        <h2>How to use?</h2>
        <h3>For people who is looking for Toys.</h3>
        <p>
          If you are looking for Retro Toys, search to find Retro Toys on the top page!
          Once you find a Toy, we don't intervene in any kinds of process,
          so please send a message to the owner and
          talk about your post.
        </p>
        <h3>For people want to show or sell their Retro Toys.</h3>
        <p>
          Go to the "Post" page and create a post with precise informations.
          If somebody wants to buy it or have questions, they will contact you. 
          Once you receive messages, please talk about how to proceed the process.
          We don't intervene in any kind of process.
        </p>
        <div>
          <Link to="/" className='btn btn-secondary'>Top</Link>
        </div>
      </div>
  );
}

export default About;