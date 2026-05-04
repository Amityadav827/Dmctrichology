const supabase = require("../config/supabase");

const assignOperationToMenu = async (req, res, next) => {
  try {
    const { menuId, operationId } = req.body;
    if (!menuId || !operationId) return res.status(400).json({ success: false, message: "Menu and Operation are required" });

    const { data, error } = await supabase
      .from('menu_operations')
      .insert([{ menu_id: menuId, operation_id: operationId }])
      .select(`*, menu:menus(name), operation:operations(name)`)
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(201).json({ 
      success: true, 
      data: { 
        ...data, 
        _id: data.id, 
        menuId: data.menu ? { ...data.menu, _id: data.menu_id } : data.menu_id,
        operationId: data.operation ? { ...data.operation, _id: data.operation_id } : data.operation_id
      } 
    });
  } catch (error) {
    next(error);
  }
};

const getMenuOperations = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('menu_operations')
      .select(`*, menu:menus(name), operation:operations(name)`);

    if (error) return res.status(500).json({ success: false, message: error.message });
    const formattedData = data.map(item => ({
      ...item,
      _id: item.id,
      menuId: item.menu ? { ...item.menu, _id: item.menu_id } : item.menu_id,
      operationId: item.operation ? { ...item.operation, _id: item.operation_id } : item.operation_id
    }));
    return res.status(200).json({ success: true, count: formattedData.length, data: formattedData });
  } catch (error) {
    next(error);
  }
};

const updateMenuOperation = async (req, res, next) => {
  try {
    const { menuId, operationId } = req.body;
    const { data, error } = await supabase
      .from('menu_operations')
      .update({ menu_id: menuId, operation_id: operationId })
      .eq('id', req.params.id)
      .select(`*, menu:menus(name), operation:operations(name)`)
      .single();

    if (error || !data) return res.status(404).json({ success: false, message: "Menu operation not found" });
    return res.status(200).json({ 
      success: true, 
      data: { 
        ...data, 
        _id: data.id, 
        menuId: data.menu ? { ...data.menu, _id: data.menu_id } : data.menu_id,
        operationId: data.operation ? { ...data.operation, _id: data.operation_id } : data.operation_id
      } 
    });
  } catch (error) {
    next(error);
  }
};

const deleteMenuOperation = async (req, res, next) => {
  try {
    const { error } = await supabase.from('menu_operations').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: "Menu operation deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  assignOperationToMenu,
  getMenuOperations,
  updateMenuOperation,
  deleteMenuOperation,
};
