/**
 * triggers for createDB.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

/* eslint-disable quotes */

export const triggers = `CREATE OR REPLACE FUNCTION func_trigger_after_insert_or_update_thing_location()
  RETURNS trigger AS
    $$
    DECLARE 
    t_id integer;
    
    BEGIN
            INSERT INTO historical_location(time, thing_id)
            VALUES(current_timestamp, new.thing_id)
            returning id into t_id;
            
            INSERT INTO location_historical_location(historical_location_id, location_id)
            VALUES(t_id, new.location_id);
            
        RETURN NEW;
    END;
    $$
    LANGUAGE 'plpgsql';

CREATE TRIGGER trigger_after_insert_thing_location
  AFTER INSERT OR UPDATE
  ON thing_location
  FOR EACH ROW
  EXECUTE PROCEDURE func_trigger_after_insert_or_update_thing_location();
`;
