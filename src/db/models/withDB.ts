/* eslint-disable @typescript-eslint/ban-ts-comment */
import withObservables from "@nozbe/with-observables";
import type { Collection, Model, Query } from "@nozbe/watermelondb";
import type { Observable } from "rxjs";
import type { ComponentType, FC } from "react";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type Observed<A> = A extends Model[]
  ? Query<ArrayElement<A>> | Collection<ArrayElement<A>>
  : A extends Model
  ? A | Observable<A> | any
  : never;

export type ObservedObject<T> = {
  [A in keyof T]: Observed<T[A]>;
};

//@ts-ignore
export type Optional<T, K extends keyof any> = Pick<Partial<T>, K> & Omit<T, K>;

export default function withDB<InputProps, ObservableProps>(
  component: ComponentType<InputProps>,
  triggerProps: Array<keyof InputProps>,
  getObservables: (
    props: InputProps
  ) => ObservedObject<ObservableProps> | { [x: string]: any }
): FC<Optional<InputProps, keyof ObservableProps>> {
  const A: FC<Optional<InputProps, keyof ObservableProps>> = withObservables<
    InputProps,
    ObservableProps
  >(
    triggerProps,

    //@ts-ignore
    getObservables
  )(
    //@ts-ignore
    component
  );
  return A;
}
// export default function withDB<InputProps, ObservableProps>(
//   triggerProps: Array<keyof InputProps>,
//   getObservables: (
//     props: InputProps
//   ) => ObservedObject<ObservableProps> | { [x: string]: any },
//   component: ComponentType<InputProps>
// ): FC<Optional<InputProps, keyof ObservableProps>> {
//   const A: FC<Optional<InputProps, keyof ObservableProps>> = withObservables<
//     InputProps,
//     ObservableProps
//   >(
//     triggerProps,
//     //@ts-ignore
//     getObservables
//     //@ts-ignore
//   )(component);

//   return A;
// }
