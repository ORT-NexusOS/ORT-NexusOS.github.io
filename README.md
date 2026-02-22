# NEXUS OS — Guia de Setup Completo
## O.R.T. — Ordem da Realidade e Tempo

---

## 🚀 Acesso Rápido (Modo Demo)
Abra `index.html` diretamente no navegador. Sem configuração, o sistema roda em **modo demo** com usuários de teste:

| Email | Senha | Clearance |
|-------|-------|-----------|
| `admin@ort.gov` | `admin123` | ADMIN |
| `agente@ort.gov` | `agente123` | AGENT |

---

## ⚙️ Configuração Completa (Produção)

### 1. Supabase (Auth + Banco de Dados)

1. Crie conta gratuita em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em **Settings → API** e copie:
   - `Project URL`
   - `anon/public` key
4. Cole em `js/config.js`:
```js
supabase: {
  url: 'SUA_URL_AQUI',
  anonKey: 'SUA_CHAVE_AQUI'
}
```

5. No Supabase, vá em **SQL Editor** e execute o schema abaixo:

```sql
-- Perfis de usuário
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  username TEXT,
  display_name TEXT,
  role TEXT DEFAULT 'agent' CHECK (role IN ('admin','agent','restricted')),
  allowed_modules TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: criar perfil automaticamente ao cadastrar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name','Agente'), 'agent');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Missões
CREATE TABLE missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'ativa' CHECK (status IN ('ativa','completa','arquivada')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- E-mails de Lore
CREATE TABLE emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT,
  recipient TEXT DEFAULT 'all',
  unread BOOLEAN DEFAULT TRUE,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Artes (URLs do Cloudinary)
CREATE TABLE artworks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  cloudinary_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vídeos das Sessões
CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  youtube_id TEXT NOT NULL,
  session_date TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itens do Cofre
CREATE TABLE vault_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Eventos da Linha do Tempo
CREATE TABLE timeline_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  universe_date TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Políticas: usuários autenticados podem ler tudo
CREATE POLICY "auth_read" ON profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_read" ON missions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_read" ON emails FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_read" ON artworks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_read" ON videos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_read" ON timeline_events FOR SELECT USING (auth.role() = 'authenticated');

-- Vault: acesso apenas ao admin (verificado no frontend por role)
CREATE POLICY "auth_read_vault" ON vault_items FOR SELECT USING (auth.role() = 'authenticated');

-- Inserções permitidas para autenticados
CREATE POLICY "auth_insert" ON artworks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_insert" ON missions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_insert" ON emails FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_insert" ON videos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_insert" ON vault_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_insert" ON timeline_events FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Updates para autenticados
CREATE POLICY "auth_update" ON missions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON timeline_events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON profiles FOR UPDATE USING (auth.role() = 'authenticated');

-- Criar seu usuário ADMIN inicial (após rodar o SQL):
-- Vá em Authentication > Users > Invite User
-- Use o email desejado, depois edite manualmente a tabela profiles
-- e mude o campo 'role' para 'admin'
```

### 2. Cloudinary (Upload de Imagens)

1. Crie conta gratuita em [cloudinary.com](https://cloudinary.com)
2. No Dashboard, copie o **Cloud Name**
3. Vá em **Settings → Upload → Upload Presets → Add Preset**
   - Defina o nome como `nexus_os_uploads`
   - Signing Mode: **Unsigned**
   - Salve
4. Cole em `js/config.js`:
```js
cloudinary: {
  cloudName: 'SEU_CLOUD_NAME',
  uploadPreset: 'nexus_os_uploads'
}
```

### 3. GitHub Pages (Hosting)

1. Crie um repositório no GitHub (pode ser público)
2. Faça upload de todos os arquivos do projeto
3. Vá em **Settings → Pages → Source: main branch**
4. Seu site estará em: `https://seu-usuario.github.io/nexus-os/`

---

## 📅 Alterar Data In-Universe

Edite o arquivo `data/universe-date.js`:
```js
const UNIVERSE_DATE = {
  day:   "23",    // ← altere aqui
  month: "11",    // ← altere aqui
  year:  "3575",  // ← altere aqui
  era:   "Era da Consolidação",
  cycle: "Ciclo Omega"
};
```

---

## 🔊 Desativar Sons

Em `js/config.js`:
```js
audio: {
  enabled: false,  // ← mude para false
  masterVolume: 0.25
}
```

---

## 📁 Estrutura do Projeto

```
nexus-os/
├── index.html          ← Entrada principal (Boot + Login + Desktop)
├── css/
│   ├── style.css       ← Estilos globais CRT
│   ├── boot.css        ← Animações de boot e login
│   └── apps.css        ← Desktop e módulos
├── js/
│   ├── config.js       ← ⚙️ SUAS CREDENCIAIS AQUI
│   ├── boot.js         ← Sequência de boot
│   ├── auth.js         ← Autenticação Supabase
│   ├── desktop.js      ← Gerenciamento do desktop
│   └── apps.js         ← Todos os módulos/apps
├── data/
│   └── universe-date.js ← 📅 DATA IN-UNIVERSE (edite aqui)
└── README.md
```
