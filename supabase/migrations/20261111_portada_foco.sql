-- Fase 10: dónde está lo importante de cada portada.
--
-- En celular la tarjeta es angosta y una captura entera se vuelve ilegible,
-- así que la portada se agranda y se ve solo un recorte. Las capturas de
-- sistemas tienen lo importante arriba a la izquierda (el menú, el título,
-- las primeras cifras); una pieza centrada, como el press kit de PressFlow,
-- lo tiene en el medio. Este campo le dice al recorte desde dónde partir.
alter table public.projects
  add column if not exists cover_focus text not null default 'izquierda'
    check (cover_focus in ('izquierda', 'centro'));
