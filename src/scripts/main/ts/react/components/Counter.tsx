import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TState } from '../../store';

export default function Counter() {
  const counter = useSelector((state: TState) => state.count);
  const dispatch = useDispatch();

  return (
    <div style={{ marginTop: '35px' }}>
      <p>
        <button style={{ width: 30, height: 30 }} onClick={() => dispatch({ type: 'MINUS' })}>
          -
        </button>
        <span style={{ fontSize: '24px', display: 'inline-block', margin: '0 15px' }}>{counter}</span>
        <button style={{ width: 30, height: 30 }} onClick={() => dispatch({ type: 'PLUS' })}>
          +
        </button>
      </p>
    </div>
  );
}
