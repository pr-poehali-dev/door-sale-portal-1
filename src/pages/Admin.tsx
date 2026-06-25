import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { DOORS_API, Door } from '@/lib/api';
import { toast } from 'sonner';

const TYPES = ['Межкомнатные', 'Входные'];
const MATERIALS = ['Массив дуба', 'Экошпон', 'Эмаль', 'Сталь'];
const EMPTY: Door = {
  id: 0, name: '', type: 'Межкомнатные', material: 'Массив дуба',
  price: 0, width: 80, height: 200, img: '',
};
const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

export default function Admin() {
  const [doors, setDoors] = useState<Door[]>([]);
  const [edit, setEdit] = useState<Door | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    fetch(DOORS_API).then((r) => r.json()).then(setDoors).catch(() => setDoors([]));

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!edit) return;
    if (!edit.name || !edit.img) {
      toast.error('Заполните название и ссылку на фото');
      return;
    }
    setSaving(true);
    const method = edit.id ? 'PUT' : 'POST';
    await fetch(DOORS_API, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edit),
    });
    setSaving(false);
    setEdit(null);
    toast.success(edit.id ? 'Товар обновлён' : 'Товар добавлен');
    load();
  };

  const remove = async (id: number) => {
    await fetch(`${DOORS_API}?id=${id}`, { method: 'DELETE' });
    toast.success('Товар удалён');
    load();
  };

  const field = (label: string, key: keyof Door, type = 'text', options?: string[]) => (
    <div>
      <label className="text-sm text-muted-foreground mb-1.5 block">{label}</label>
      {options ? (
        <select
          value={edit![key] as string}
          onChange={(e) => setEdit({ ...edit!, [key]: e.target.value })}
          className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 outline-none focus:border-primary"
        >
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          value={edit![key] as string | number}
          onChange={(e) => setEdit({ ...edit!, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
          className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 outline-none focus:border-primary"
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground grain">
      <header className="glass border-b border-border/50 sticky top-0 z-40">
        <div className="container flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <Icon name="LayoutDashboard" className="text-primary" size={26} />
            <span className="font-display text-2xl font-bold">Админка товаров</span>
          </div>
          <div className="flex gap-3">
            <Link to="/">
              <Button variant="outline" className="border-primary/40">
                <Icon name="ArrowLeft" size={18} className="mr-2" /> На сайт
              </Button>
            </Link>
            <Button onClick={() => setEdit({ ...EMPTY })} className="gradient-gold text-primary-foreground">
              <Icon name="Plus" size={18} className="mr-2" /> Добавить
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-10">
        <div className="grid gap-4">
          {doors.map((d) => (
            <div key={d.id} className="flex items-center gap-4 bg-card border border-border/50 rounded-2xl p-4">
              <img src={d.img} alt={d.name} className="w-16 h-20 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-xl font-semibold truncate">{d.name}</h3>
                <p className="text-sm text-muted-foreground">{d.type} · {d.material} · {d.width}×{d.height} см</p>
              </div>
              <span className="font-display text-xl font-bold text-primary whitespace-nowrap">{fmt(d.price)}</span>
              <div className="flex gap-2">
                <button onClick={() => setEdit(d)} className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:text-primary">
                  <Icon name="Pencil" size={18} />
                </button>
                <button onClick={() => remove(d.id)} className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:text-destructive">
                  <Icon name="Trash2" size={18} />
                </button>
              </div>
            </div>
          ))}
          {doors.length === 0 && (
            <p className="text-center text-muted-foreground py-20">Товаров пока нет</p>
          )}
        </div>
      </main>

      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">{edit.id ? 'Редактировать' : 'Новый товар'}</h2>
              <button onClick={() => setEdit(null)} className="text-muted-foreground hover:text-foreground">
                <Icon name="X" size={22} />
              </button>
            </div>
            <div className="space-y-4">
              {field('Название', 'name')}
              <div className="grid grid-cols-2 gap-4">
                {field('Тип', 'type', 'text', TYPES)}
                {field('Материал', 'material', 'text', MATERIALS)}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {field('Цена, ₽', 'price', 'number')}
                {field('Ширина, см', 'width', 'number')}
                {field('Высота, см', 'height', 'number')}
              </div>
              {field('Ссылка на фото', 'img')}
              {edit.img && <img src={edit.img} alt="" className="w-full h-40 object-cover rounded-lg" />}
              <Button onClick={save} disabled={saving} className="w-full gradient-gold text-primary-foreground font-semibold">
                {saving ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
