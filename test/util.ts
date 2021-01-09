export function asMock<T>(obj: T) {
  return (obj as unknown) as jest.Mock<T>
}
