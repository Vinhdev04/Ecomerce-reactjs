import React from 'react';
import './Loading.scss';

function Loading({ style = 'default', text = 'Dữ liệu đang được tải...', subtext = 'Các thiên thần ơi, Vui lòng chờ trong giây lát!' }) {
  const renderSpinner = () => {
    switch (style) {
      case 'dots':
        return (
          <div className="spinner">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        );
      case 'spinner':
        return <div className="spinner"></div>;
      default:
        return (
          <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
          </div>
        );
    }
  };

  return (
    <div className={`loading-container ${style !== 'default' ? `style-${style}` : ''}`}>
      <div className="loading-content">
        {renderSpinner()}
        <div className="loading-text">{text}</div>
        <div className="loading-subtext">{subtext}</div>
      </div>
    </div>
  );
}

export default Loading;