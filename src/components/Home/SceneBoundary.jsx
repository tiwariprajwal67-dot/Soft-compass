import { Component } from 'react'

// A "safety net". If anything inside it crashes (for example the 3D scene),
// it shows the "fallback" instead of letting the whole website go blank.
export default class SceneBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.warn('3D scene unavailable, showing the simple version:', error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}