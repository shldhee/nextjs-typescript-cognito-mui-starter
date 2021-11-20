import { rest } from 'msw'
export const handlers = [
  rest.get('/login', async (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'asdfjaso;idfjsadf',
        firstName: 'Jimmy',
        lastName: 'LEE',
      }),
    )
  }),
  rest.get(
    'https://raw.githubusercontent.com/techoi/raw-data-api/main/simple-api.json',
    async (req, res, ctx) => {
      const id = req.url.searchParams.get('id')
      return res(
        ctx.json({
          data: {
            people: [
              {
                name: id,
                age: 35,
              },
              {
                name: 'timmy',
                age: 13,
              },
              {
                name: 'cindy',
                age: 15,
              },
              {
                name: 'judy',
                age: 25,
              },
              {
                name: 'marry',
                age: 64,
              },
              {
                name: 'tommy',
                age: 109,
              },
            ],
          },
        }),
      )
    },
  ),
]
