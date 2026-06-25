import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet';

const INTERIOR_IMG = 'https://cdn.poehali.dev/projects/5b3f5f4c-2089-4e4d-8e24-9781f6cda1b4/files/032c1871-747c-4f1c-8044-4fc37970d682.jpg';
const ENTRANCE_IMG = 'https://cdn.poehali.dev/projects/5b3f5f4c-2089-4e4d-8e24-9781f6cda1b4/files/e2e12d35-cfc4-4bac-87b6-5d2cf2e68ce7.jpg';

interface Door {
  id: number;
  name: string;
  type: 'Межкомнатные' | 'Входные';
  material: string;
  price: number;
  width: number;
  height: number;
  img: string;
}

const DOORS: Door[] = [
  { id: 1, name: 'Лофт Натура', type: 'Межкомнатные', material: 'Массив дуба', price: 24900, width: 80, height: 200, img: INTERIOR_IMG },
  { id: 2, name: 'Скандинавия', type: 'Межкомнатные', material: 'Экошпон', price: 12400, width: 70, height: 200, img: INTERIOR_IMG },
  { id: 3, name: 'Бастион Сталь', type: 'Входные', material: 'Сталь', price: 48700, width: 90, height: 205, img: ENTRANCE_IMG },
  { id: 4, name: 'Гранд Антик', type: 'Входные', material: 'Сталь', price: 62300, width: 96, height: 210, img: ENTRANCE_IMG },
  { id: 5, name: 'Минима Уайт', type: 'Межкомнатные', material: 'Эмаль', price: 18600, width: 80, height: 200, img: INTERIOR_IMG },
  { id: 6, name: 'Терра Венге', type: 'Межкомнатные', material: 'Массив дуба', price: 31200, width: 90, height: 200, img: INTERIOR_IMG },
  { id: 7, name: 'Форт Премиум', type: 'Входные', material: 'Сталь', price: 71500, width: 96, height: 210, img: ENTRANCE_IMG },
  { id: 8, name: 'Эко Лайт', type: 'Межкомнатные', material: 'Экошпон', price: 9900, width: 70, height: 200, img: INTERIOR_IMG },
];

const MATERIALS = ['Массив дуба', 'Экошпон', 'Эмаль', 'Сталь'];
const TYPES = ['Межкомнатные', 'Входные'] as const;
const NAV = ['Главная', 'Каталог', 'О нас', 'Услуги', 'Портфолио', 'Контакты'];

const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

export default function Index() {
  const [type, setType] = useState<string | null>(null);
  const [materials, setMaterials] = useState<string[]>([]);
  const [price, setPrice] = useState<[number, number]>([9000, 75000]);
  const [width, setWidth] = useState<[number, number]>([70, 96]);
  const [cart, setCart] = useState<Door[]>([]);

  const toggleMaterial = (m: string) =>
    setMaterials((p) => (p.includes(m) ? p.filter((x) => x !== m) : [...p, m]));

  const filtered = useMemo(
    () =>
      DOORS.filter(
        (d) =>
          (!type || d.type === type) &&
          (materials.length === 0 || materials.includes(d.material)) &&
          d.price >= price[0] && d.price <= price[1] &&
          d.width >= width[0] && d.width <= width[1],
      ),
    [type, materials, price, width],
  );

  const addToCart = (d: Door) => setCart((p) => [...p, d]);
  const removeFromCart = (i: number) => setCart((p) => p.filter((_, idx) => idx !== i));
  const total = cart.reduce((s, d) => s + d.price, 0);

  const reset = () => {
    setType(null); setMaterials([]); setPrice([9000, 75000]); setWidth([70, 96]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground grain">
      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 glass border-b border-border/50">
        <div className="container flex items-center justify-between h-20">
          <a href="#" className="flex items-center gap-2">
            <Icon name="DoorOpen" className="text-primary" size={28} />
            <span className="font-display text-2xl font-bold tracking-wide">ДВЕРИ<span className="text-primary">.</span></span>
          </a>
          <nav className="hidden lg:flex items-center gap-8">
            {NAV.map((n) => (
              <a key={n} href={n === 'Каталог' ? '#catalog' : '#'} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {n}
              </a>
            ))}
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative border-primary/40 hover:bg-primary/10">
                <Icon name="ShoppingBag" size={18} />
                <span className="ml-2 hidden sm:inline">Корзина</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full gradient-gold text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-card border-border flex flex-col">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">Ваша корзина</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto mt-6 space-y-4">
                {cart.length === 0 && (
                  <p className="text-muted-foreground text-center mt-12">Корзина пуста</p>
                )}
                {cart.map((d, i) => (
                  <div key={i} className="flex gap-3 items-center bg-secondary/50 rounded-lg p-3">
                    <img src={d.img} alt={d.name} className="w-14 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{d.material}</p>
                      <p className="text-primary font-semibold text-sm">{fmt(d.price)}</p>
                    </div>
                    <button onClick={() => removeFromCart(i)} className="text-muted-foreground hover:text-destructive">
                      <Icon name="X" size={18} />
                    </button>
                  </div>
                ))}
              </div>
              {cart.length > 0 && (
                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex justify-between mb-4">
                    <span className="text-muted-foreground">Итого</span>
                    <span className="font-display text-2xl font-bold text-primary">{fmt(total)}</span>
                  </div>
                  <Button className="w-full gradient-gold text-primary-foreground font-semibold">
                    Оформить заказ
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img src={INTERIOR_IMG} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="absolute top-1/4 right-10 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="container relative z-10">
          <div className="max-w-2xl animate-fade-in">
            <p className="text-primary tracking-[0.3em] uppercase text-sm mb-6">Салон премиальных дверей</p>
            <h1 className="font-display text-6xl md:text-8xl font-bold leading-[0.95] mb-6">
              Двери, которые <span className="text-gradient-gold">впечатляют</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-lg">
              Межкомнатные и входные двери из массива, стали и эмали. Замер, доставка и установка под ключ.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#catalog">
                <Button size="lg" className="gradient-gold text-primary-foreground font-semibold glow-gold hover-scale">
                  Смотреть каталог
                  <Icon name="ArrowRight" className="ml-2" size={18} />
                </Button>
              </a>
              <Button size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10">
                Заказать замер
              </Button>
            </div>
            <div className="flex gap-10 mt-16">
              {[['12', 'лет на рынке'], ['8000+', 'установок'], ['5 лет', 'гарантия']].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-4xl font-bold text-primary">{n}</div>
                  <div className="text-sm text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="py-24 scroll-mt-20">
        <div className="container">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="text-primary tracking-[0.3em] uppercase text-sm mb-3">Каталог</p>
              <h2 className="font-display text-5xl font-bold">Выберите свою дверь</h2>
            </div>
            <p className="text-muted-foreground">Найдено: {filtered.length}</p>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-10">
            {/* FILTERS */}
            <aside className="space-y-8 lg:sticky lg:top-28 self-start">
              <div className="glass rounded-2xl p-6 border border-border/50 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold">Фильтры</h3>
                  <button onClick={reset} className="text-xs text-muted-foreground hover:text-primary">Сбросить</button>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Тип</p>
                  <div className="flex flex-col gap-2">
                    {TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setType(type === t ? null : t)}
                        className={`text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                          type === t
                            ? 'border-primary bg-primary/15 text-primary'
                            : 'border-border hover:border-primary/40'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Материал</p>
                  <div className="flex flex-col gap-2">
                    {MATERIALS.map((m) => (
                      <label key={m} className="flex items-center gap-3 cursor-pointer group">
                        <span
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                            materials.includes(m) ? 'gradient-gold border-primary' : 'border-border group-hover:border-primary/50'
                          }`}
                        >
                          {materials.includes(m) && <Icon name="Check" size={14} className="text-primary-foreground" />}
                        </span>
                        <input type="checkbox" className="hidden" checked={materials.includes(m)} onChange={() => toggleMaterial(m)} />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground">{m}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="font-medium">Цена</span>
                    <span className="text-primary">{fmt(price[0])} — {fmt(price[1])}</span>
                  </div>
                  <Slider min={9000} max={75000} step={1000} value={price} onValueChange={(v) => setPrice(v as [number, number])} />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="font-medium">Ширина, см</span>
                    <span className="text-primary">{width[0]} — {width[1]}</span>
                  </div>
                  <Slider min={70} max={96} step={1} value={width} onValueChange={(v) => setWidth(v as [number, number])} />
                </div>
              </div>
            </aside>

            {/* GRID */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((d, i) => (
                <div
                  key={d.id}
                  className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/40 transition-all animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="relative overflow-hidden aspect-[4/5]">
                    <img src={d.img} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <span className="absolute top-3 left-3 glass text-xs px-3 py-1 rounded-full border border-border/50">{d.type}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-2xl font-semibold mb-1">{d.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{d.material} · {d.width}×{d.height} см</p>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-2xl font-bold text-primary">{fmt(d.price)}</span>
                      <Button size="sm" onClick={() => addToCart(d)} className="gradient-gold text-primary-foreground">
                        <Icon name="Plus" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-20 text-muted-foreground">
                  <Icon name="SearchX" size={48} className="mx-auto mb-4 opacity-50" />
                  По заданным фильтрам ничего не найдено
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-24 bg-card/40">
        <div className="container grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img src={ENTRANCE_IMG} alt="О нас" className="rounded-3xl w-full object-cover aspect-[4/3]" />
            <div className="absolute -bottom-6 -right-6 glass rounded-2xl p-6 border border-primary/30">
              <div className="font-display text-4xl font-bold text-primary">№1</div>
              <div className="text-sm text-muted-foreground">салон в регионе</div>
            </div>
          </div>
          <div>
            <p className="text-primary tracking-[0.3em] uppercase text-sm mb-3">О нас</p>
            <h2 className="font-display text-5xl font-bold mb-6">Мастерство в каждой детали</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Уже 12 лет мы создаём пространство, в которое хочется возвращаться. Работаем только с проверенными
              производителями, контролируем качество на каждом этапе — от выбора материала до финальной установки.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['ShieldCheck', 'Гарантия 5 лет'],
                ['Truck', 'Доставка по городу'],
                ['Ruler', 'Бесплатный замер'],
                ['Wrench', 'Монтаж под ключ'],
              ].map(([icon, label]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary">
                    <Icon name={icon} size={20} />
                  </span>
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-primary tracking-[0.3em] uppercase text-sm mb-3">Услуги</p>
            <h2 className="font-display text-5xl font-bold">Полный цикл под ключ</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              ['Ruler', 'Замер', 'Точный выезд мастера в удобное время — бесплатно при заказе.'],
              ['Hammer', 'Установка', 'Профессиональный монтаж с гарантией качества и аккуратностью.'],
              ['Sparkles', 'Сервис', 'Регулировка, реставрация и обслуживание дверей после установки.'],
            ].map(([icon, title, desc], i) => (
              <div
                key={title}
                className="group bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/40 hover-scale animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center text-primary-foreground mb-6">
                  <Icon name={icon} size={26} />
                </span>
                <h3 className="font-display text-2xl font-semibold mb-3">{title}</h3>
                <p className="text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="py-24 bg-card/40">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-primary tracking-[0.3em] uppercase text-sm mb-3">Портфолио</p>
            <h2 className="font-display text-5xl font-bold">Наши работы</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[INTERIOR_IMG, ENTRANCE_IMG, INTERIOR_IMG, ENTRANCE_IMG, INTERIOR_IMG, ENTRANCE_IMG].map((img, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl aspect-square">
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div>
                    <p className="font-display text-2xl font-semibold">Проект №{i + 1}</p>
                    <p className="text-sm text-muted-foreground">Жилой комплекс «Премьер»</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section className="py-24">
        <div className="container grid md:grid-cols-2 gap-16">
          <div>
            <p className="text-primary tracking-[0.3em] uppercase text-sm mb-3">Контакты</p>
            <h2 className="font-display text-5xl font-bold mb-8">Приезжайте в салон</h2>
            <div className="space-y-5">
              {[
                ['MapPin', 'г. Москва, ул. Дверная, 24'],
                ['Phone', '+7 (495) 123-45-67'],
                ['Mail', 'salon@dveri.ru'],
                ['Clock', 'Ежедневно с 9:00 до 21:00'],
              ].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-4">
                  <span className="w-11 h-11 rounded-lg bg-primary/15 flex items-center justify-center text-primary">
                    <Icon name={icon} size={20} />
                  </span>
                  <span className="text-lg">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-8 border border-border/50">
            <h3 className="font-display text-2xl font-semibold mb-6">Оставьте заявку</h3>
            <div className="space-y-4">
              <input placeholder="Ваше имя" className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors" />
              <input placeholder="Телефон" className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors" />
              <textarea placeholder="Комментарий" rows={4} className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors resize-none" />
              <Button className="w-full gradient-gold text-primary-foreground font-semibold">Отправить заявку</Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/50 py-12">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Icon name="DoorOpen" className="text-primary" size={24} />
            <span className="font-display text-xl font-bold">ДВЕРИ<span className="text-primary">.</span></span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Салон премиальных дверей. Все права защищены.</p>
          <div className="flex gap-4">
            {['Send', 'MessageCircle', 'Phone'].map((icon) => (
              <a key={icon} href="#" className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Icon name={icon} size={18} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
