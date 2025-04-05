import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/todos', () => {
    return HttpResponse.json([
      { id: 1, text: 'プロジェクトの設計書を作成', completed: false },
      { id: 2, text: 'APIの実装', completed: true },
      { id: 3, text: 'テストコードを書く', completed: false },
      { id: 4, text: 'UIデザインの改善', completed: false },
      { id: 5, text: 'パフォーマンスの最適化', completed: true },
    ])
  }),

  http.post('/api/todos', async ({ request }) => {
    const todos = await request.json();
    return HttpResponse.json(todos);
  })
] 