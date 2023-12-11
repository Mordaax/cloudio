"use client";

import React, { useRef, useEffect } from 'react';
import Guacamole from 'guacamole-common-js';
import encrypt from './encrypt';
import { Button } from '../ui/button';

const GuacamoleStage = () => {
  const myRef = useRef(null);


  useEffect(() => {
    const token = encrypt({
      connection: {
        type: 'ssh',
        settings: {
          hostname: '10.10.1.17', // Replace with IP
          username: 'placehodler',
          password: 'placeholder',
          'enable-drive': true,
          'create-drive-path': true,
          security: 'any',
          'ignore-cert': true,
          'enable-wallpaper': false,
        },
      },
    });

    const tunnel = new Guacamole.WebSocketTunnel('ws://10.10.1.17:8080/');
    const client = new Guacamole.Client(tunnel);
    
    /* myRef

    if (!myRef.current?.hasChildNodes?()) {
        myRef.current?.appendChild(client.getDisplay().getElement());
      } */
    client.connect('token=' + token);

    // Cleanup function
    return () => {
      // Cleanup logic if needed
      // For example, disconnecting the client
      //client.disconnect();
    };
  }, []); // Empty dependency array ensures useEffect runs only once after the initial render

  return (
  <>
  <div ref={myRef} />
  <Button
        className="w-[250px]"
        onClick={() => {
          
        }}
      >Stop</Button>
  </>)
  
};

export default GuacamoleStage;
