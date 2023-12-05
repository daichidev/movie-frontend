declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module '*.svg' {
  const ReactComponent: React.FunctionComponent<
    React.SVGAttributes<SVGElement>
  >;
  export { ReactComponent };
}
