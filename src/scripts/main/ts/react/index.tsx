import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from '../store';
import CheckboxWithLabel from './components/CheckboxWithLabel';
import Counter from './components/Counter';
import imgSvg from 'Images/webpack-logo.svg';
import imgPng from 'Images/download.png';

const App: React.FC = () => {
  return (
    <div style={{ marginTop: '35px' }} className='wrapper'>
      <div>
        <h2>This is react component from main entrypoint</h2>
        <p style={{ marginTop: '20px', fontSize: '18px' }}>from here</p>
        <code>
          <pre>/src/scripts/main/ts/react/index.tsx</pre>
        </code>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 25 }}>
        <p style={{ marginRight: 50 }}>
          This is SVG
          <br />
          <img style={{ width: 200 }} src={imgSvg} alt='svg' />
        </p>

        <p>
          This is PNG
          <br />
          <img style={{ width: 200 }} src={imgPng} alt='PNG' />
        </p>
      </div>

      <Counter />
      <CheckboxWithLabel labelOn={'Checked'} labelOff={'Not checked'} />
    </div>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('ts-main-react')
);
