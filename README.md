# FinanTrack 2

Controle pessoal de receitas e despesas em React, Vite, Capacitor e Supabase.

## Usar e desenvolver

Requer Node.js 24. Execute `npm ci`, `npm test` e `npm run dev`. Para produção: `npm run build`.

O app já está configurado com o endereço do projeto Supabase e uma chave publicável. Essa chave pode aparecer no cliente; as políticas de RLS restringem as linhas ao dono. Nunca coloque `service_role`, credenciais bancárias ou segredos de provedores no cliente, no GitHub ou em variáveis `VITE_*`.

Login e cadastro usam Supabase Auth. Se a confirmação de e-mail estiver ativa, o titular deve confirmar o cadastro antes do primeiro acesso. A demonstração usa dados fictícios apenas em memória e não grava no Supabase.

## Funcionalidades

- Resumo mensal de receitas, despesas e resultado; gráficos diários e por categoria.
- Cadastro, edição e exclusão com confirmação; valores em reais com vírgula.
- Busca, filtro por categoria e tipo; exportação CSV do período e filtro selecionados.
- Layout para computador e celular; opção para ocultar os valores.
- Estados de erro e nova tentativa; leitura paginada dos registros.

Os valores refletem os registros do usuário. Não representam saldo bancário consultado automaticamente.

## Android

O fluxo do GitHub Actions instala as dependências pelo lockfile, testa, compila o web app e gera o APK. Também pode ser executado manualmente em Actions. O arquivo original ZIP foi preservado como histórico; a compilação usa o código na raiz do repositório.

Para compilar localmente: JDK 21+, Android SDK 36, `npx cap add android`, `npx cap sync android`, `node scripts/android-config.mjs` e `android/gradlew assembleDebug` dentro da pasta android (no Windows: `gradlew.bat assembleDebug`).

O APK de teste é assinado com a chave debug da máquina de compilação. A assinatura pode diferir da versão antiga; o Android pode exigir desinstalar a anterior. Antes de desinstalar, confirme que seus dados foram sincronizados/exportados. Uma distribuição permanente precisa de uma chave de assinatura estável, protegida nos segredos do GitHub, nunca no código.

## Banco de dados

O esquema existente está em `supabase-schema.sql` para referência histórica; não o execute novamente no projeto existente. `database-hardening.sql` registra o ajuste aplicado nas políticas e privilégios. RLS está habilitada e os testes de isolamento entre usuários foram executados com dados temporários dentro de uma transação revertida.

## Open Finance — próximo passo

A tela Meus bancos informa o estado real: integração em preparação. Nenhum banco ou provedor está conectado ainda.

Para ativar: contratar/configurar um provedor com cobertura no Brasil, validar a disponibilidade de bancos via sua API, guardar as credenciais exclusivamente em segredos de funções de backend, implementar o fluxo de consentimento por banco, sincronização e revogação, e testar em sandbox antes da produção. A autorização deve ser feita pelo titular no ambiente bancário. O app não deve coletar senhas bancárias.

Arquitetura proposta: app autenticado → função Supabase que emite token temporário → interface de conexão do provedor → consentimento bancário → webhook verificado → fila de processamento → importação idempotente no Supabase. Vincular cada conexão ao usuário verificado no servidor, nunca aceitar um `user_id` arbitrário do cliente ou do webhook. Proteger tabelas por RLS; restringir alterações dos dados importados ao backend. Usar identificador externo único por provedor/conexão/transação; tratar paginação, alterações, estornos, duplicatas e exclusões. Distinguir transferência entre contas próprias, compra no cartão e pagamento de fatura para evitar contagem dupla. Exibir última atualização, falha, expiração e renovação do consentimento. A periodicidade depende do provedor e do banco.

Bancos prioritários: Nubank, Itaú, Bradesco, Banco do Brasil, Caixa, Santander e Inter. A lista exibida deve vir do provedor; essa prioridade não é garantia de cobertura. O compartilhamento de Open Finance é gratuito ao titular, mas o provedor de integração pode cobrar pelo serviço. Confirmar preços e condições antes de contratar.

Referências: [Banco Central](https://www.bcb.gov.br/meubc/faqs/p/como-levar-seus-dados-de-um-banco-para-outro), [Pluggy](https://docs.pluggy.ai/en/docs/quickstart), [webhooks](https://docs.pluggy.ai/en/reference/webhooks).
