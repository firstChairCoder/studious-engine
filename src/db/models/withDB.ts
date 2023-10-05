/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ComponentType, FC } from "react";
import withObservable from "@nozbe/with-observables";
import type { Collection, Model, Query } from "@nozbe/watermelondb";
import type { Observable } from "rxjs";

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
  triggerProps: Array<keyof InputProps>,
  getObservables: (
    props: InputProps
  ) => ObservedObject<ObservableProps> | { [x: string]: any },
  component: ComponentType<InputProps>
): FC<Optional<InputProps, keyof ObservableProps>> {
  //@ts-ignore
  const A: FC = withObservable(triggerProps, getObservables)(component);

  return A;
}
