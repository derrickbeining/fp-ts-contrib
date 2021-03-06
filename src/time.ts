/**
 * @since 0.1.0
 */
import { now } from 'fp-ts/lib/Date'
import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from 'fp-ts/lib/HKT'
import { MonadIO, MonadIO1, MonadIO2, MonadIO2C, MonadIO3 } from 'fp-ts/lib/MonadIO'

/**
 * Mimics the analogous Unix command: given an action `HKT<M, A>`, we can derive an action `HKT<M, [A, number]>` that
 * returns the elapsed time along with the computed value
 *
 * @example
 * import { io } from 'fp-ts/IO'
 * import { randomInt } from 'fp-ts/Random'
 * import { time } from 'fp-ts-contrib/time'
 *
 * const timeIO = time(io)
 *
 * function fib(n: number): number {
 *   return n <= 1 ? 1 : fib(n - 1) + fib(n - 2)
 * }
 *
 * timeIO(io.map(randomInt(30, 35), fib))() // [ 14930352, 127 ]
 *
 * @since 0.1.0
 */
export function time<M extends URIS3>(M: MonadIO3<M>): <R, E, A>(ma: Kind3<M, R, E, A>) => Kind3<M, R, E, [A, number]>
export function time<M extends URIS2>(M: MonadIO2<M>): <E, A>(ma: Kind2<M, E, A>) => Kind2<M, E, [A, number]>
export function time<M extends URIS2, E>(M: MonadIO2C<M, E>): <A>(ma: Kind2<M, E, A>) => Kind2<M, E, [A, number]>
export function time<M extends URIS>(M: MonadIO1<M>): <A>(ma: Kind<M, A>) => Kind<M, [A, number]>
export function time<M>(M: MonadIO<M>): <A>(ma: HKT<M, A>) => HKT<M, [A, number]>
export function time<M>(M: MonadIO<M>): <A>(ma: HKT<M, A>) => HKT<M, [A, number]> {
  const nowM = M.fromIO(now)
  return (ma) => M.chain(nowM, (start) => M.chain(ma, (a) => M.map(nowM, (end) => [a, end - start])))
}
