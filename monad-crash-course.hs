-- A Monad is a typeclass defined like this:
class Monad m where
  return :: a -> m a 
  (>>=)  :: m a -> (a -> m b) -> m b
  
-- return wraps a value in a monadic context
-- >>= (bind) chains computations together

-- Example: Maybe Monad
data Maybe a = Just a | Nothing  

instance Monad Maybe where
  return x = Just x
  (Just x) >>= f = f x
  Nothing  >>= _ = Nothing

-- Using Maybe:
safeDiv :: Int -> Int -> Maybe Int
safeDiv x 0 = Nothing
safeDiv x y = Just (div x y)

-- Chaining:
example :: Maybe Int
example = do
  x <- safeDiv 10 2
  y <- safeDiv x 0
  z <- safeDiv 8 4
  return (x + y + z)
  
-- This will return Nothing because safeDiv x 0 returns Nothing

-- The key points:
-- 1. Monads wrap values in contexts 
-- 2. Monads allow chaining computations via bind (>>=)
-- 3. Monads handle sequencing and short-circuiting automatically

-- Other common Monads: IO, State, List, Either, etc.
-- Monads enable pure, functional handling of effects like state, errors, and I/O.
