import React from 'react';
import numeral from 'numeral';

const yuan = (val, withSymbol = true) => {
  const prefix = withSymbol ? '¥ ' : '';

  if (val > 10000) {
    return `${prefix}${numeral(val / 10000).format('0, 1.0')}万`;
  }
  return `${prefix}${numeral(val).format('0,0')}`;
};

/**
 * 减少使用 dangerouslySetInnerHTML
 */
export default class Yuan extends React.PureComponent {
  componentDidMount() {
    this.rendertoHtml();
  }

  componentDidUpdate() {
    this.rendertoHtml();
  }

  rendertoHtml = () => {
    const { children, withSymbol } = this.props;
    if (this.main) {
      this.main.innerHTML = yuan(children, withSymbol);
    }
  };

  render() {
    return (
      <span
        ref={ref => {
          this.main = ref;
        }}
      />
    );
  }
}
