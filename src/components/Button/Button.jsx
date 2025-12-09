import React from 'react';
import styles from './Button.module.scss';
function Button({ content }) {
    const { btn } = styles;
    return <button className={btn}>{content}</button>;
}

export default Button;
