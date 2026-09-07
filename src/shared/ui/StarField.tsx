import type { StarSpec } from '@/shared/lib/stars'

type Props = {
  stars: StarSpec[]
  shoots?: Array<{ id: number }>
  className: string
  starClassName: string
  shootClassName?: string
}

export function StarField({
  stars,
  shoots,
  className,
  starClassName,
  shootClassName,
}: Props) {
  return (
    <div className={className} aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className={starClassName}
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
      {shoots?.map((shoot) => (
        <span key={`shoot-${shoot.id}`} className={shootClassName} />
      ))}
    </div>
  )
}
