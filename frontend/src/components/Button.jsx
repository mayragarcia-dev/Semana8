export default function Button({ children, variant = 'primary', as: Element = 'button', className = '', ...props }) {
  return <Element className={`button button--${variant} ${className}`.trim()} {...props}>{children}</Element>
}
