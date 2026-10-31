-- Applied to the existing project. Preserves records and existing table structure.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
alter policy "Usuários podem ver seu próprio perfil" on public.profiles to authenticated using ((select auth.uid()) = id);
alter policy "Usuários podem atualizar seu próprio perfil" on public.profiles to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
alter policy "Usuário visualiza apenas suas transações" on public.transactions to authenticated using ((select auth.uid()) = user_id);
alter policy "Usuário insere suas próprias transações" on public.transactions to authenticated with check ((select auth.uid()) = user_id);
alter policy "Usuário atualiza suas próprias transações" on public.transactions to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "Usuário exclui suas próprias transações" on public.transactions to authenticated using ((select auth.uid()) = user_id);
