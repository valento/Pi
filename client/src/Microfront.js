import React from 'react'

export default class MicroFront extends React.Component {
  componentDidMount() {
    const { name, document, host } = this.props
    fetch(`${host}/asset-manifest.json`, {
      method: 'GET'
    })
    .then(res => {
      return res.json()
    })
    .then(manifest => {
      const initScript = document.createElement('script')
      initScript.id = 'scriptCart'
      initScript.crossOrigin = ''
      initScript.src = `${host}${manifest.files['main.js']}`
      initScript.onload = this.renderMicroFront
      document.head.appendChild(initScript)
    })
  }

  renderMicroFront = () => {
    const { name,window,history } = this.props
    window[`render${name}`](`${name}-container`, history, name)
    window.Store.add(name)
    window.Store.notify('new')
    console.log(window.GS.getState())
  }

  render() {
    const {name} = this.props
    return (<div id={`${name}-container`}>.</div>)
  }
}

MicroFront.defaultProps = {
  document,
  window,
};
